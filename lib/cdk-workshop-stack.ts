import * as lambda from '@aws-cdk/aws-lambda'
import * as gateway from '@aws-cdk/aws-apigateway'
import * as cdk from '@aws-cdk/core';
import { HitCounter } from './hitcounter'

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: helloLambda
    })

    new gateway.LambdaRestApi(this, 'HelloEndpoint', {
      handler: helloWithCounter.handler
    });
  }
}
