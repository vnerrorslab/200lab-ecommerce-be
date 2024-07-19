import { MysqlPaymentRepository } from './infas/repository/mysql-payment-repository'
import { PaymentService } from './infas/transport/rest/routes'
import { PaymentUseCase } from './usecase/payment-usecase'

export const paymentService = new PaymentService(new PaymentUseCase(new MysqlPaymentRepository()))
