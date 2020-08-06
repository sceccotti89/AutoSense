'use strict';

import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Response } from './common/models';
import * as dynamoDbOps from './common/dynamoDbOperations';
import * as HttpStatus from 'http-status-codes';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context: Context): Promise<Response> => {
  console.log("Event: " + JSON.stringify(event));
  try {
    await validateRequest(event);
    const response = await getCarFromFleet(event.pathParameters.carId);
    return response;
  } catch (e) {
    return e;
  }
};

const getCarFromFleet = (carId: string): Promise<Response> => {
  const params = {
    TableName: process.env.FLEET_TABLE,
    Key: { 'id': { S: carId } }
};
  return dynamoDbOps.getItem(params);
};

const validateRequest = (event: APIGatewayProxyEvent): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    if (!event.pathParameters.carId || !dynamoDbOps.isUuid(event.pathParameters.carId)) {
      console.log("Missing or invalid path parameter 'carId'");
      reject(new Response(HttpStatus.BAD_REQUEST, "Missing or invalid path parameter 'carId'"));
    } else {
      resolve();
    }
  });
};
