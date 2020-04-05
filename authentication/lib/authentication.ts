import * as core from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class Authentication extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
    });

    const handler = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('src/function.zip'),
      handler: 'index.handler',
      environment: {
        TABLE: table.tableName,
      },
    });

    table.grantReadWriteData(handler);

    const api = new apigateway.RestApi(this, 'API', {
      restApiName: 'Authentication',
      description: 'This API serves Toptal project authentication.',
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(handler);

    const user = api.root.addResource('user');
    user.addMethod('GET', lambdaIntegration);
    user.addMethod('POST', lambdaIntegration);
    user.addMethod('PUT', lambdaIntegration);
    user.addMethod('DELETE', lambdaIntegration);

    const auth = api.root.addResource('auth');
    auth.addMethod('POST', lambdaIntegration);
  }
}
