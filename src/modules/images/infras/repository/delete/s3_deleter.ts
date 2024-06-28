import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { IImageDeleter } from '~/modules/images/interfaces/usecase'
import { config } from 'dotenv'

config()

export class S3Deleter implements IImageDeleter {
  constructor() {}

  async deleteImage(filename: string): Promise<boolean> {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename
    }

    //delete file on s3
    try {
      s3.send(new DeleteObjectCommand(deleteParams))
    } catch (error) {
      console.error(error)
      return false
    }

    return true
  }

  cloudName(): string {
    return 'aws-s3'
  }
}

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string
  }
})
