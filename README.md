# AutoSense

![CI](https://github.com/sceccotti89/AutoSense/workflows/CI/badge.svg?branch=master)

The AutoSense project is a fleet management online service designed and implemented using cutting-edge technologies such as Angular and AWS.

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Architecture](#architecture)
- [Back-End](#back-end)
  - [Execution](#execution)
  - [Testing](#testing)
- [Front-End](#front-end)
  - [UI Execution](#ui-execution)
  - [UI Testing](#ui-testing)
- [GitHub Pipeline](#github-pipeline)

## Architecture

The internal structure of the project is composed of 3 main folders:

- **BackEnd** containing all the necessary files to run and build the back-end infrastructure.
- **FrontEnd** containing all the necessary files to run and build the front-end UI application.
- **.github** to deploy both front-end and back-end using the GitHub pipeline.

The following is the complete architecture of the application:

<a href='https://github.com/sceccotti89/AutoSense/blob/master/Documentation/AWS_Diagram.png'><img src='https://github.com/sceccotti89/AutoSense/blob/master/Documentation/AWS_Diagram.png' height='200' width='600' alt='AWS Diagram' aria-label='aws_diagram' /></a>

This architecture has been deployed for 2 different environments: **dev** (for testing) and **prod** (for the public release), reachable at these addresses:

- dev:  https://dev.d2pldw8ud20gv5.amplifyapp.com/
- prod: https://prod.d2pldw8ud20gv5.amplifyapp.com/

## Back-End

The whole back-end infrastructure is deployed using *serverless*, which defins the following services:

- API Gateway: it acts as a "front-end" of the AWS infrastructure, gathering all the incoming requests from outside.
- AWS Lambda: the API Gateway is connected to a proper AWS Lambda according to the given url. This will helps us managing all the different operations on the dataset.
- DynamoDB: a NoSQL database used to manage all the operations on the fleet dataset. We can fetch the whole fleet but we can also get, add, and delete a single car.

Because there is no authentication nor authorization layer, all the HTTP requests must include an *API-KEY*, different for each environment. Without it you'll get a 403 (Forbidden) as a response from the API Gateway.

### Execution

To test each AWS Lambda locally you should first run DynamoDB locally. To accomplish this you can run the **run-dinamo-db.sh** script inside the *dynamoDB* folder. Be careful, before running it you should have installed *Docker* and edited the *aws-configure.sh* script to use your AWS account replacing *** with your credentials. Finally you can run a Lambda using this command:

```bash
serverless invoke local -f "function-name" -e AWS_LOCAL=1
```

where function-name is the name of the lambda function, the -f argument specifies the function to invoke, and -e the environment variable to run it locally. For other options please refer to this: https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/.

### Testing

Unit tests can be executed running this command:

```bash
npm run test

//alias for
mocha -r ts-node/register ./**/*.spec.ts
```

which runs all the *.spec.ts* files.

## Front-End

The front-end application has been implemented using Angular to produce a Single Page Application (SPA). It's a Mobile First - namely it runs on any device and resolution - and Progressive Web App (PWA) application - meaning that you are able to access a cached version of the application when offline. In case a newer version of the application has been deployed the user is asked to reload the page.

It is deployed using AWS Amplify. It's a tool provided by Amazon Web Service to help you deploy a Web Application in few steps, with the capability to manage multiple environments. It comes with interesting features, such as integration with HTTPS and *Restrict Access*. Thanks to that, specific environments can be accessed only with username and password.

### UI Execution

To run the front-end application you only have to type:

```bash
npm run start

//alias for
ng serve
```

using the *dev* environment settings.<br/>
The command:

```bash
npm run start -- --prod
```

won't work, because the production environment file doesn't contain valid API KEYs (it only contains placeholders that will be replaced at deployment time in the GitHub Pipeline).

To run the application as a PWA, you need first to build it first with the *--prod* flag, then run a local web server in the same folder of the built application (I suggest using the http-server package for an easy deploy) and finally open the web page at the server address. You should see some error messages (because of the wrong keys) but you should be able to play with the application also in offline mode.

### UI Testing

There are 2 types of tests: *unit* and *integration*.
To run unit tests just type:

```bash
npm run test

//alias for
ng test
```

This command will tests all the *\*.spec.ts* files inside the */src* folder.<br/>
If you need to run them in headless mode (particularly useful in Continous Integration environments), then run the above command with the following flags:

```bash
npm run test -- --no-watch --code-coverage --no-progress --browsers=ChromeHeadlessCI
```

Also the e2e tests can be run in 2 different ways:

```bash
npm run e2e
//alias for
ng run autosense:cypress-open
```

that will execute e2e tests in watch mode using Cypress. Any changes to the code will automatically run again all tests.<br/>
The other option is the headless mode:

```bash
npm run e2e:ci

//alias for
start-server-and-test start http://localhost:4200 cy:run
```

Note that e2e tests are not running in *master* to prevent any database "pollution" in the production environment.

## GitHub Pipeline

To automate the workflow of the application, both front-end and back-end are deployed using GitHub Pipeline. Sensitive data are stored in the Secrets storage of the repository. Only authorized people can access them.

The workflow is consisted of 2 steps:

- **test**: here is where we run all the tests (unit and integration)
- **deploy**: in which we deploy the front-end (using AWS Amplify) and the back-end (using serverless) services

Those 2 steps are replicated for front- and back-end. First start with the back-end steps, then if successful, start the front-end ones. This specific order comes to the rescue when any of the already deployed API are changed: you might get an error while running the front-end integration tests. With this solution we make sure that the new API are deployed before starting integrations tests on them.
If the *test* job fails, the *deploy* step is not executed and you'll receive an email containing the failing commit.<br/>
In order to deploy everything to the right environment the script make use of a variable named *STAGE*. It assumes the value *prod* in case of a push/pull-request to master, *dev* in all other cases (develop or feature/* branch).<br/>
API KEYs replacements is performed using the powerful *sed* command, substituing the placeholders contained in the environment.prod.ts file of the UI with the respective value in the Secrets storage. This is executed for the *master* branch only.