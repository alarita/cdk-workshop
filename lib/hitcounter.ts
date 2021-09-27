import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export interface HitCounterProps {
    downstream: lambda.IFunction
}

export class HitCounter extends cdk.Construct {
    public readonly handler: lambda.Function

    constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        const hitTable = new dynamodb.Table(this, 'Hits', {
            tableName: 'hello-hit-counters',
            partitionKey: {
                name: 'path',
                type: dynamodb.AttributeType.STRING
            }
        })

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'hitcounter.handler',
            code: lambda.Code.fromAsset('lambda'),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: hitTable.tableName
            }
        })

        // grant the lambda role read/write permissions to our table
        hitTable.grantReadWriteData(this.handler)

        // grant the lambda role invoke permissions to the downstream function
        props.downstream.grantInvoke(this.handler)
    }
}
