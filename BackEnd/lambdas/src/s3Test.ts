import * as AWS from 'aws-sdk';
import { Response } from './common/models';
import * as HttpStatus from 'http-status-codes';

export const handler = async (event, context, callback) => {
    const S3 = new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: 'http://localhost:8000',
    });

    const params: AWS.S3.PutObjectRequest = {
        Bucket: 'local-bucket',
        Key: '1234',
        Body: JSON.stringify({ data: 'Data' })
    };
    await S3.putObject(params).promise();
    return new Response(HttpStatus.OK, 'Okay');
};

export const s3hook = (event, context) => {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    console.log(JSON.stringify(process.env));
};
