import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import * as dynamoDBModule from '../src/common/dynamoDbOperations';
import { handler } from '../src/deleteCarFromFleet';
import { Response } from '../src/common/models';
import * as HttpStatus from 'http-status-codes';

import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;

describe("deleteCarFromFleet.handler", () => {
    const mockId: string = 'da957c6e-36ec-4d92-af76-fbf9a11a021b';
    let dynamoDbStub: sinon.SinonStub;

    beforeEach(() => {
        dynamoDbStub = sinon.stub(dynamoDBModule, "deleteItem");
    });

    it('should invoke the handler method with no carId parameter and return 400', async () => {
        const event: APIGatewayProxyEvent = createEvent(undefined);
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.body).to.equal('{\n  "message": "Missing or invalid path parameter \'carId\'"\n}');
    });

    it('should invoke the handler method with invalid carId parameter and return 400', async () => {
        const event: APIGatewayProxyEvent = createEvent('invalid_id');
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.body).to.equal('{\n  "message": "Missing or invalid path parameter \'carId\'"\n}');
    });

    it('should invoke the handler method with valid carId parameter and return 200', async () => {
        const event: APIGatewayProxyEvent = createEvent(mockId);
        const mockResponse: Response = new Response(HttpStatus.OK, `Car ${mockId} removed successfully.`);

        dynamoDbStub.returns(Promise.resolve(mockResponse));
        
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.OK);
        expect(response.body).to.deep.eq(mockResponse.body);
    });

    it('should call dynamo db deleteItem and return 500 due to internal error', async () => {
        const event: APIGatewayProxyEvent = createEvent(mockId);

        dynamoDbStub.returns(Promise.reject(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Error whilst deleting input data")));
        
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.equal('{\n  "message": "Error whilst deleting input data"\n}');
    });

    afterEach(() => {
        dynamoDbStub.restore();
    });
});

const createEvent = (pathValue: string): APIGatewayProxyEvent => {
    const event: APIGatewayProxyEvent = {
        headers: null,
        body: undefined,
        httpMethod: null,
        isBase64Encoded: false,
        multiValueHeaders: null,
        multiValueQueryStringParameters: null,
        path: null,
        pathParameters: {
            carId: pathValue
        },
        queryStringParameters: null,
        requestContext: null,
        resource: null,
        stageVariables: null
    };
    return event;
}