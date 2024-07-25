import fs from 'fs'
import { config } from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { IImageUploader } from '~/modules/images/interfaces/usecase'

config()

export class S3Uploader implements IImageUploader {
  constructor() {}

  async uploadImage(filename: string, filesize: number, contentType: string): Promise<boolean> {
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: filename,
        Body: fs.readFileSync(filename),
        ContentType: contentType,
        ContentLength: filesize
      },
      tags: [
        /*...*/
      ], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false // optional manually handle dropped parts
    })

    await parallelUploads3.done()
    return true
  }

  cloudName(): string {
    return 'aws-s3'
  }
}

//set up new S3 client
export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string
  }
})
