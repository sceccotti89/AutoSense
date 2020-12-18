import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import * as dynamoDBModule from '../src/common/dynamoDbOperations';
import { handler } from '../src/getCarFromFleet';
import { Response, Car } from '../src/common/models';
import * as HttpStatus from 'http-status-codes';

import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;

describe("getCarFromFleet.handler", () => {
    const mockId: string = 'da957c6e-36ec-4d92-af76-fbf9a11a021b';
    let dynamoDbStub: sinon.SinonStub;

    beforeEach(() => {
        dynamoDbStub = sinon.stub(dynamoDBModule, "getItem");
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

    it('should invoke the handler method with valid carId parameter and no matching id then return 400', async () => {
        const event: APIGatewayProxyEvent = createEvent(mockId);
        dynamoDbStub.returns(Promise.reject(new Response(HttpStatus.BAD_REQUEST, "Invalid id 'carId'")));
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.body).to.equal('{\n  "message": "Invalid id \'carId\'"\n}');
    });

    it('should invoke the handler method with valid carId parameter and return car with status 200', async () => {
        const event: APIGatewayProxyEvent = createEvent(mockId);
        const result: Car = {
            id: mockId,
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
        const mockResponse: Response = new Response(HttpStatus.OK, result);

        dynamoDbStub.returns(Promise.resolve(mockResponse));
        
        const response = <APIGatewayProxyResult> await handler(event, null, null);
        expect(response.statusCode).to.equal(HttpStatus.OK);
        expect(response.body).to.deep.eq(mockResponse.body);
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
