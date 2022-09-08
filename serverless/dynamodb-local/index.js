'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const dynamodbLocal = require('dynamodb-localhost');

class ServerlessDynamodbLocal {
  constructor(serverless, options) {
    this.provider = 'aws';
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);

    this.config = _.get(this.service, 'custom.dynamodb', {});
    this.options = {
      localPath: '.dynamodb',
      ...options,
    };

    this.commands = {
      dynamodb: {
        commands: {
          migrate: {
            lifecycleEvents: ['migrateHandler'],
            usage:
              'Creates local DynamoDB tables from the current Serverless configuration',
          },
          start: {
            lifecycleEvents: ['startHandler'],
            usage: 'Starts local DynamoDB',
            options: {
              port: {
                shortcut: 'p',
                usage:
                  'The port number that DynamoDB will use to communicate with your application. If you do not specify this option, the default port is 8000',
                type: 'string',
              },
              dbPath: {
                shortcut: 'd',
                usage:
                  'The directory where DynamoDB will write its database file. If you do not specify this option, the file will be written to the current directory. Note that you cannot specify both -dbPath and -inMemory at once. For the path, current working directory is <projectroot>/node_modules/serverless-dynamodb-local/dynamob. For example to create <projectroot>/node_modules/serverless-dynamodb-local/dynamob/<mypath> you should specify -d <mypath>/ or --dbPath <mypath>/ with a forwardslash at the end.',
                type: 'string',
              },
              convertEmptyValues: {
                shortcut: 'e',
                usage:
                  'Set to true if you would like the document client to convert empty values (0-length strings, binary buffers, and sets) to be converted to NULL types when persisting to DynamoDB.',
                type: 'boolean',
              },
            },
          },
          noStart: {
            shortcut: 'n',
            default: false,
            usage:
              'Do not start DynamoDB local (in case it is already running)',
          },
          install: {
            usage: 'Installs local DynamoDB',
            lifecycleEvents: ['installHandler'],
            options: {
              localPath: {
                shortcut: 'x',
                usage: 'Local dynamodb install path',
                type: 'string',
              },
            },
          },
        },
      },
    };

    this.hooks = {
      'dynamodb:migrate:migrateHandler': this.migrateHandler.bind(this),
      'dynamodb:install:installHandler': this.installHandler.bind(this),
      'dynamodb:start:startHandler': this.startHandler.bind(this),
      'before:offline:start:init': this.startHandler.bind(this),
    };
  }

  get port() {
    return _.get(this.service, 'custom.dynamodbLocal.port', 8000);
  }

  dynamodbClient() {
    return new AWS.DynamoDB({
      endpoint: `http://localhost:${this.port}`,
      region: 'localhost',
      accessKeyId: 'MOCK_KEY_ID',
      secretAccessKey: 'MOCK_ACCESS_KEY',
      convertEmptyValues: false,
    });
  }

  migrateHandler() {
    const config = _.get(this.service, 'custom.dynamodbLocal', {});

    const tablePath = config.tables;
    const tablesRaw = fs.readFileSync(tablePath);
    const tables = JSON.parse(tablesRaw.toString());

    return Promise.all(tables.map((table) => this.createTable(table)));
  }

  installHandler() {
    const options = this.options;
    const localPath = path.join(
      this.serverless.config.servicePath,
      options.localPath,
    );

    return new Promise((resolve) => dynamodbLocal.install(resolve, localPath));
  }

  getDbPath(dbPath) {
    if (!dbPath || path.isAbsolute(dbPath)) {
      return dbPath;
    } else {
      return path.join(this.serverless.config.servicePath, dbPath);
    }
  }

  startHandler() {
    const options = {
      ...this.options,
      install_path: this.options.localPath,
      dbPath: this.getDbPath(this.options.dbPath),
    };

    // otherwise endHandler will be mis-informed
    this.options = options;

    if (!options.noStart) {
      dynamodbLocal.start(options);
    }

    return this.migrateHandler();
  }

  async createTable(migration) {
    const client = this.dynamodbClient();
    const defaultProvisioning = {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    };

    migration.ProvisionedThroughput = defaultProvisioning;
    if (migration.GlobalSecondaryIndexes) {
      migration.GlobalSecondaryIndexes.forEach((gsi) => {
        gsi.ProvisionedThroughput = defaultProvisioning;
      });
    }

    await client.createTable(migration).promise();
    this.serverlessLog(`DynamoDB - created table ${migration.TableName}`);
  }
}

module.exports = ServerlessDynamodbLocal;
