# AutoSense

![CI](https://github.com/sceccotti89/AutoSense/workflows/CI/badge.svg?branch=master)

This project has been developed for autoSense AG (https://autosense.ch/).

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Introduction](#introduction)
- [Back-End](#back-end)
  - [Execution](#execution)
  - [Testing](#testing)
- [Front-End](#front-end)
  - [Execution](#execution)
  - [Testing](#testing)
- [GitHub Pipeline](#github-pipeline)

## Introduction

The internal structure of the project is composed of 3 main folders:

- **BackEnd** containing all the necessary files to run and build the back-end infrastructure.
- **FrontEnd** containing all the necessary files to run and build the front-end UI application.
- **.github** to deploy both front-end and back-end using the GitHub pipeline.

The following is the complete architecture of the application:

<a href='https://github.com/sceccotti89/AutoSense/blob/feature/documentation/Documentation/AWS_Diagram.png'><img src='https://github.com/sceccotti89/AutoSense/blob/feature/documentation/Documentation/AWS_Diagram.png' height='200' width='600' alt='AWS Diagram' aria-label='aws_diagram' /></a>

We will discuss deeply about it in the following sections.<br/>
The above architecture has been deployed for 2 different environments: **dev** (for testing) and **prod** (for the public release), reachable at https://dev.d2pldw8ud20gv5.amplifyapp.com/ and https://prod.d2pldw8ud20gv5.amplifyapp.com/ respectively.

## Back-End

The back-end infrastructure is deployed using *serverless*. By means of a YAML file you are able to define services and roles very easily. All the requests are served by an API Gateway, which in turn is connected to a proper AWS Lambda according to the given url. Each Lambda is then connected to DynamoDB, used to store each car of the fleet. We can fetch the whole fleet or get, add, and delete a single car.<br/>
Because there is no authentication nor authorization phase, all the HTTP(S) requests must include an *API-KEY*, different for each environment. Without it you'll get a 403 (Forbidden) as a response.

### Execution

To test each lambda locally you must first run DynamoDB locally either following this guide https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html or running it inside a Docker container (suggested) and configure each lambda to be connected to it.
Then you can type the following command:

```bash
serverless invoke -f "function-name" -l
```

where function-name is the name of your lambda function.

### Testing

Unit tests can be executed running this command:

```bash
npm run test
```

which is based on the *mocha* command.

## Front-End

The front-end application has been implemented using Angular to produce a Single Page Application (SPA). It's a Mobile First - namely it runs perfectly on any device and resolution - and a Progressive Web App (PWA) - meaning that you are still able to access the application also in offline mode - application. In case of a newer version the user is prompted to reload the page.

It is deployed using AWS Amplify. It's a tool provided by Amazon Web Service to help you deploy a Web Application in few steps, with the ability to manage multiple environments. It comes with interesting features, like integration with HTTPS and *Restrict Access*. Thanks to that, the *dev* environment can be accessed only with username and password (user: **test**, pwd: **testers**).

### Execution

To run the front-end application you only have to type:

```bash
npm run start
```

This will execute the application in *dev* environment.<br/>
The command:

```bash
npm run start -- --prod
```

won't work, because the environment file for production doesn't contain a valid value for the the API KEYs (it contains placeholders that will be replaced during deployment time in the GitHub Pipeline).

To run the application as a PWA, you need to build it first with the *--prod* flag, run a local web server where you built the application (I suggest using the http-server package for an easy deploy) and finally open the web page at the address of the server. You should see some error messages (because of the keys) but you should be able to play with the application also in offline mode.

### Testing

There are 2 types of tests: *unit* and *integration*.
To run unit tests just type:

```bash
npm run test
```

This command will tests all the *\*.spec.ts* files.<br/>
If you need to run them in headless mode (particularly usefull in Continous Integration environments), then run the above command with the following flags:

```bash
npm run test -- --no-watch --code-coverage --no-progress --browsers=ChromeHeadlessCI
```

Also the e2e tests can be run in 2 different ways:

```bash
npm run e2e
```

that will execute e2e test in watch mode using Cypress.
The other way is by using:

```bash
npm run e2e:ci
```

that will run tests in headless mode.

Note that e2e tests are not running in master to prevent any possible database issue with the production environment.

## GitHub Pipeline

To deploy both front-end and back-end I used the GitHub Pipeline, automating the workflow of the application. All the sensitive data are stored in the secret store of the repositiory. Only authorized people can access them.

The workflow is defined in 2 steps:

- **test**: here is where we run all the tests (unit and integration)
- **deploy**: in which we deploy the front-end (using AWS Amplify) and the back-end (serverless) 

In cae the *test* phase fails, the deploy step is not executed.<br/>
In order to deploy everything to the right environment a variable named *STAGE* is define in the *deploy* step. It assumes the value *prod* in case of a push/pull-request to master, *dev* in all other cases (develop or feature/* branch).<br/>
API KEYs replacements is performed using the powerful *sed* command using placeholders contained in the environment.prod.ts file of the UI. This is performed for the *master* branch only.