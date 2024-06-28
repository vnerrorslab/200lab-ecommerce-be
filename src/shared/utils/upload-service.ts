import fs from 'fs'
import { config } from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

config()

//set up new S3 client
export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string
  }
})

export const uploadFileToS3 = ({ filename, contentType }: { filename: string; contentType: string }) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: filename,
      Body: fs.readFileSync(filename),
      ContentType: contentType
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })

  parallelUploads3.on('httpUploadProgress', (progress) => {
    // console.log(progress)
  })
  return parallelUploads3.done()
}
