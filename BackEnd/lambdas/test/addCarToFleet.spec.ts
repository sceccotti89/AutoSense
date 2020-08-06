import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import * as dynamoDBModule from '../src/common/dynamoDbOperations';
import { handler } from '../src/addCarToFleet';
import { Response, Car } from '../src/common/models';
import * as HttpStatus from 'http-status-codes';

import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;

describe("addCarToFleet.handler", () => {
    let dynamoDbStub: sinon.SinonStub;
    let dynamoDbIdStub: sinon.SinonStub;

    beforeEach(() => {
        dynamoDbStub = sinon.stub(dynamoDBModule, "putItem");
        dynamoDbIdStub = sinon.stub(dynamoDBModule, "generateId");
    });

    it('should invoke the handler method not passing validation and return 400', async () => {
        const body: Car = createBody();
        // Battery is missing, validation would fail.
        body.battery = undefined;

        const event: APIGatewayProxyEvent = createEvent(body);
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.body).to.equal(JSON.stringify({ message: [{ parameter: "battery", message: "Required value." }] }, null, 2));
    });

    it('should call dynamo db putItem and return 200 with an object containing a random generated id', async () => {
        const body: Car = createBody();
        const mockId: string = 'test_id';

        const event: APIGatewayProxyEvent = createEvent(body);

        dynamoDbStub.returns(Promise.resolve(new Response(HttpStatus.OK, null)));
        dynamoDbIdStub.returns(mockId);
        
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.deep.eq(JSON.stringify({ message: { id: mockId } }, null, 2));
    });

    it('should call dynamo db putItem and return 500', async () => {
        const body: Car = createBody();
        const mockId: string = 'test_id';

        const event: APIGatewayProxyEvent = createEvent(body);

        dynamoDbStub.returns(Promise.reject(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Error whilst persisting input data")));
        dynamoDbIdStub.returns(mockId);
        
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.equal('{\n  "message": "Error whilst persisting input data"\n}');
    });

    afterEach(() => {
        dynamoDbStub.restore();
        dynamoDbIdStub.restore();
    });
});

const createBody = (): Car => {
    return {
        id: undefined,
        name: "Executive car 1",
        vin: "ASD423E3D3RF5",
        make: "Mazda",
        model: "CX-5",
        year: 2019,
        fuelType: "petrol",
        type: "SUV",
        position: {
            lat: 3.995,
            lon: 43.2221
        },
        odometer: 43546,
        fuel: 33.4,
        battery: 12.7
    };
};

const createEvent = (body: any): APIGatewayProxyEvent => {
    const event: APIGatewayProxyEvent = {
        headers: null,
        body: JSON.stringify(body),
        httpMethod: null,
        isBase64Encoded: false,
        multiValueHeaders: null,
        multiValueQueryStringParameters: null,
        path: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: null,
        resource: null,
        stageVariables: null
    };
    return event;
}