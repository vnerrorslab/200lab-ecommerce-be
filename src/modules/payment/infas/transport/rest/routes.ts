import axios from 'axios'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
import { NextFunction, Request, Response, Router } from 'express'
import moment from 'moment'
import { IPaymentUseCase } from '~/modules/payment/interfaces/usecase'
import { IPaymentZaloType, PaymentSearchDTO } from '~/modules/payment/model/payment'
import { actions } from '~/shared/constant/actions.contat'
import { roles } from '~/shared/constant/roles.constant'
import { Paging } from '~/shared/dto/paging'
import { PaymentStatus } from '~/shared/dto/status'
import { authorizeMiddleWare } from '~/shared/middleware/authorization-middleware'
import { PaymentCreateDTO } from '../dto/payment-create'
import qs from 'qs'
import { PaymentUpdateStatusDTO } from '../dto/payment-update'

dotenv.config()

const config = {
  app_id: process.env.APP_ID as string,
  key1: process.env.KEY1 as string,
  key2: process.env.KEY2 as string,
  endpoint_create: process.env.ENDPOINT_CREATE as string,
  endpoint_query: process.env.ENDPOINT_QUERY as string
}

export class PaymentService {
  constructor(readonly paymentUseCase: IPaymentUseCase) {}

  async getAllPayment(req: Request, res: Response) {
    const { searchStr, status } = req.query

    const condition = new PaymentSearchDTO(searchStr as string, status as string)

    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1

    const paging: Paging = new Paging(page, 0, limit)

    const { payments, total_pages } = await this.paymentUseCase.list_paginate(condition, paging)

    const total = Math.ceil(total_pages / limit)

    return res.status(200).json({ code: 200, message: 'list payment', data: payments, total_pages: total })
  }

  async getPaymentById(req: Request, res: Response) {
    const { id } = req.params

    const payment = await this.paymentUseCase.findById(id)

    res.status(200).json({ code: 200, message: 'payment', data: payment })
  }

  async payment(req: Request, res: Response) {
    const { orderId, amount, currency = 'vnd', redirectUrl, cancleUrl } = req.body

    const userId = req.user?.userId as string

    const embed_data = {
      merchantinfo: 'embeddata123',
      redirecturl: redirectUrl,
      cancleurl: cancleUrl
    }
    const item: [] = []
    const transID = Math.floor(Math.random() * 1000000)

    const order: IPaymentZaloType = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: userId,
      app_time: Date.now(),
      item: JSON.stringify(item),
      embed_data: JSON.stringify(embed_data),
      callback_url: `https://9195-171-252-155-156.ngrok-free.app/v1/callback`,
      amount: amount,
      description: `Payment for the order #${transID}`,
      discount_amount: 0,
      bank_code: 'zalopayapp'
    }

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

    try {
      const result = await axios.post(config.endpoint_create, null, { params: order })

      if (result?.data.return_code === 2) {
        res.status(500).send('Payment creation failed')
      }

      const paymentCreate = new PaymentCreateDTO(
        orderId,
        amount,
        currency,
        userId,
        PaymentStatus.PENDING,
        order.app_trans_id,
        new Date(),
        order.description,
        order.discount_amount as number
      )

      await this.paymentUseCase.createPayment(paymentCreate)

      return res.status(200).json(result.data)
    } catch (error) {
      res.status(500).send('Payment creation failed')
    }
  }

  async paymentCallback(req: Request, res: Response) {
    let result: { returncode: number; returnmessage: string } = { returncode: -1, returnmessage: '' }

    try {
      let dataStr = req.body.data
      let reqMac = req.body.mac

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2 as string).toString()
      console.log('mac =', mac)

      if (reqMac !== mac) {
        result.returncode = -1
        result.returnmessage = 'mac not equal'
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2 as any)

        const id = dataJson['app_trans_id']

        result.returncode = 1
        result.returnmessage = 'success'

        console.log("update order's status = success where apptransid =", id)
      }
    } catch (ex: any) {
      result.returncode = 0 // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.returnmessage = ex.message
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result)
  }

  async getPaymentStatus(req: Request, res: Response) {
    try {
      const { appTransId } = req.body
      let postData: {
        app_id: string
        app_trans_id: string
        mac?: string
      } = {
        app_id: config.app_id,
        app_trans_id: appTransId
      }

      let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1
      postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

      let postConfig = {
        method: 'post',
        url: config.endpoint_query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
      }

      const result = await axios(postConfig)

      if (result.data.return_code === 1) {
        const paymentStatus = new PaymentUpdateStatusDTO(postData.app_trans_id, PaymentStatus.SUCCESS)

        await this.paymentUseCase.updatePayment(paymentStatus)

        return res.json(200).json({ message: 'Payment success' })
      }
    } catch (error) {
      res.status(500).send('Payment failed')
    }
  }

  setupRoutes(auth: (req: Request, res: Response, next: NextFunction) => void): Router {
    const router = Router()

    router.get('/payment', auth, authorizeMiddleWare([roles.ADMIN], actions.READ), this.getAllPayment.bind(this))
    router.get(
      '/payment/:id',
      auth,
      authorizeMiddleWare([roles.ADMIN, roles.USER], actions.READ),
      this.getPaymentById.bind(this)
    )
    router.post('/payment', auth, this.payment.bind(this))
    router.post('/callback', this.paymentCallback.bind(this))
    router.post('/query', this.getPaymentStatus.bind(this))

    return router
  }
}
