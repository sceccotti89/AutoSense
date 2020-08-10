import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './models';
import { DeleteItemInput, PutItemInput, ScanInput, GetItemInput } from 'aws-sdk/clients/dynamodb';
import * as HttpStatus from 'http-status-codes';

const uuidv4_regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const generateId = () => {
    return uuidv4();
};
export const isUuid = (id: string): boolean => uuidv4_regex.test(id);

export const scan = (params: ScanInput): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const dynamoDB = new AWS.DynamoDB(getClientConfiguration());
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Error whilst retrieving data"));
            } else {
                const result: any[] = data.Items.map((item) => {
                    return AWS.DynamoDB.Converter.unmarshall(item);
                });
                resolve(new Response(HttpStatus.OK, result));
            }
        });
    });
};

export const getItem = (params: GetItemInput): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const dynamoDB = new AWS.DynamoDB(getClientConfiguration());
        dynamoDB.getItem(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Error whilst retrieving data"));
            } else {
                if (!data.Item) {
                    reject(new Response(HttpStatus.BAD_REQUEST, "Invalid id 'carId'"));
                } else {
                    const result = AWS.DynamoDB.Converter.unmarshall(data.Item);
                    resolve(new Response(HttpStatus.OK, result));
                }
            }
        });
    });
};

export const putItem = (params: PutItemInput): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const dynamoDB = new AWS.DynamoDB(getClientConfiguration());
        dynamoDB.putItem(params, (err, _data) => {
            if (err) {
                console.log(err, err.stack);
                reject(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Error whilst persisting input data"));
            } else { 
                resolve();
            }
        });
    });
};

export const deleteItem = (params: DeleteItemInput): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const dynamoDB = new AWS.DynamoDB(getClientConfiguration());
        dynamoDB.deleteItem(params, (err, _data) => {
            if (err) {
                console.log(err, err.stack);
                reject(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Error whilst deleting input data"));
            } else {
                resolve();
            }
        });
    });
};

const getClientConfiguration = (): AWS.DynamoDB.ClientConfiguration => {
    const configuration: AWS.DynamoDB.ClientConfiguration = {
        region: 'eu-central-1',
        apiVersion: '2012-08-10'
    };
    if (process.env.AWS_LOCAL) {
        configuration.endpoint = 'http://localhost:8500';
    }
    return configuration;
};