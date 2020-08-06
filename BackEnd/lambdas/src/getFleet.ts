'use strict';

import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Response } from './common/models';
import * as dynamoDbOps from './common/dynamoDbOperations';

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent, _context: Context): Promise<Response> => {
  try {
    const response = await getFleet();
    console.log('Response: ', response);
    return response;
  } catch (e) {
    return e;
  }
};

const getFleet = (): Promise<Response> => {
  const params = {
    TableName: process.env.FLEET_TABLE
  };
  return dynamoDbOps.scan(params);
};
