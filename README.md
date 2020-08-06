# AutoSense

![CI](https://github.com/sceccotti89/AutoSense/workflows/CI/badge.svg?branch=master)

The AutoSense project is a fleet management online service designed and implemented using cutting-edge technologies such as Angular and AWS.

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Architecture](#architecture)
- [Back-End](#back-end)
  - [Execution](#execution)
  - [Testing](#testing)
- [Front-End](#front-end)
  - [Execution](#execution)
  - [Testing](#testing)
- [GitHub Pipeline](#github-pipeline)

## Architecture

The internal structure of the project is composed of 3 main folders:

- **BackEnd** containing all the necessary files to run and build the back-end infrastructure.
- **FrontEnd** containing all the necessary files to run and build the front-end UI application.
- **.github** to deploy both front-end and back-end using the GitHub pipeline.

The following is the complete architecture of the application:

<a href='https://github.com/sceccotti89/AutoSense/blob/master/documentation/Documentation/AWS_Diagram.png'><img src='https://github.com/sceccotti89/AutoSense/blob/master/documentation/Documentation/AWS_Diagram.png' height='200' width='600' alt='AWS Diagram' aria-label='aws_diagram' /></a>

This architecture has been deployed for 2 different environments: **dev** (for testing) and **prod** (for the public release), reachable at these addresses:

- dev:  https://dev.d2pldw8ud20gv5.amplifyapp.com/
- prod: https://prod.d2pldw8ud20gv5.amplifyapp.com/

## Back-End

The whole back-end infrastructure is deployed using *serverless*, defining the following services: an API Gateway used to gather all the incoming requests from outside. This in turn is connected to a proper AWS Lambda according to the given url. Each Lambda is then connected to DynamoDB, used to manage all the operations on the fleet. We can fetch the whole fleet but we can also get, add, and delete a single car.<br/>
Because there is no authentication nor authorization layer, all the HTTP requests must include an *API-KEY*, different for each environment. Without it you'll get a 403 (Forbidden) as a response.

### Execution

To test each AWS Lambda locally you should first run DynamoDB locally either installing it on your machine or inside a Docker container. Once it has been set up you should change the database connection on the Lambdas to point to the local one. Finally you can run a Lambda using this command:

```bash
serverless invoke -f "function-name" -l
```

where function-name is the name of the lambda function. The -f argument specifies the function to invoke and the -l flag tells serverless to output the logs to the console.

### Testing

Unit tests can be executed running this command:

```bash
npm run test

//alias for
mocha -r ts-node/register ./**/*.spec.ts
```

## Front-End

The front-end application has been implemented using Angular to produce a Single Page Application (SPA). It's a Mobile First - namely it runs on any device and resolution - and Progressive Web App (PWA) application - meaning that you are able to access a cached version of the application when offline. In case a newer version of the application has been deployed the user is asked to reload the page.

It is deployed using AWS Amplify. It's a tool provided by Amazon Web Service to help you deploy a Web Application in few steps, with the capability to manage multiple environments. It comes with interesting features, such as integration with HTTPS and *Restrict Access*. Thanks to that, specific environments can be accessed only with username and password (to access the *dev* environment you can use the following credentials, user: **test**, pwd: **testers**).

### Execution

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

### Testing

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

To deploy both front-end and back-end I used the GitHub Pipeline, in order to automate the workflow of the application. Sensitive data are stored in the Secrets storage of the repository. Only authorized people can access them.

The workflow is consisted of 2 steps:

- **test**: here is where we run all the tests (unit and integration)
- **deploy**: in which we deploy the front-end (using AWS Amplify) and the back-end (serverless) services

In case the *test* job fails, the *deploy* step is not executed and you'll receive an email containing the failing commit.<br/>
In order to deploy everything to the right environment the script make use of a variable named *STAGE*. It assumes the value *prod* in case of a push/pull-request to master, *dev* in all other cases (develop or feature/* branch).<br/>
API KEYs replacements is performed using the powerful *sed* command, substituing the placeholders contained in the environment.prod.ts file of the UI with the respective value in the Secrets storage. This is executed for the *master* branch only.