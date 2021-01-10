'use strict';

import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as validator from 'node-validator';
import { Response, Car } from './common/models';
import * as AWS from 'aws-sdk';
import * as dynamoDbOps from './common/dynamoDbOperations';
import * as HttpStatus from 'http-status-codes';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context: Context): Promise<Response> => {
  console.log("Event: " + JSON.stringify(event));
  try {
    const data: Car = JSON.parse(event.body);
    await validateRequest(data);
    await storeCarIntoFleetTable(data);
    return new Response(HttpStatus.OK, { id: data.id });
  } catch (e) {
    return e;
  }
}

const storeCarIntoFleetTable = (request: Car): Promise<Response> => {
  request.id = dynamoDbOps.generateId();
  const params = {
    Item: AWS.DynamoDB.Converter.marshall(request),
    TableName: process.env.FLEET_TABLE
  };
  return dynamoDbOps.putItem(params);
};

const validateRequest = (data: Car): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    validator.run(requestValidator(), data, (errorCount, errors) => {
      if (errorCount > 0) {
        console.log(errors);
        reject(new Response(HttpStatus.BAD_REQUEST, errors));
      } else {
        resolve(null);
      }
    });
  });
}

const requestValidator = (): validator.IsObjectValidator => {
  return validator.isObject()
          .withRequired("name", validator.isString())
          .withRequired("vin", validator.isString())
          .withRequired("make", validator.isString())
          .withRequired("model", validator.isString())
          .withRequired("year", validator.isNumber())
          .withRequired("fuelType", validator.isString())
          .withRequired("type", validator.isString())
          .withRequired("position", validator.isObject()
                        .withRequired('lat', validator.isNumber())
                        .withRequired('lon', validator.isNumber()))
          .withRequired("odometer", validator.isInteger())
          .withRequired("fuel", validator.isNumber())
          .withRequired("battery", validator.isNumber());
}
