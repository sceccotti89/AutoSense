import { APIGatewayProxyResult } from 'aws-lambda';
import * as dynamoDBModule from '../src/common/dynamoDbOperations';
import { handler } from '../src/getFleet';
import { Response, Car } from '../src/common/models';
import * as HttpStatus from 'http-status-codes';

import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;

describe("getFleet.handler", () => {
    let dynamoDbStub: sinon.SinonStub;
    
    beforeEach(() => {
        dynamoDbStub = sinon.stub(dynamoDBModule, "scan");
    });

    it('should call dynamo db scan and return an empty list', async () => {
        dynamoDbStub.returns(Promise.resolve(new Response(HttpStatus.OK, [])));

        const response = <APIGatewayProxyResult> await handler(null, null, null);
        expect(response.statusCode).to.equal(HttpStatus.OK);
        expect(response.body).to.equal('{\n  "message": []\n}');
        expect(dynamoDbStub.called).to.equal(true);
    });

    it('should call dynamo db scan and return a fleet', async () => {
        const result: Car[] = [{
            id: '12345678',
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
        }];

        dynamoDbStub.returns(Promise.resolve(new Response(HttpStatus.OK, result)));

        const response = <APIGatewayProxyResult> await handler(null, null, null);
        expect(response.statusCode).to.equal(HttpStatus.OK);
        expect(response.body).to.equal(JSON.stringify({ message: result }, null, 2) );
        expect(dynamoDbStub.called).to.equal(true);
    });

    it('should call dynamo db scan and return a 500 error due to internal error', async () => {
        dynamoDbStub.returns(Promise.resolve(new Response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error whilst retrieving data')));

        const response = <APIGatewayProxyResult> await handler(null, null, null);
        expect(response.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.equal('{\n  "message": "Error whilst retrieving data"\n}');
        expect(dynamoDbStub.called).to.equal(true);
    });

    afterEach(() => {
        dynamoDbStub.restore();
    });
});