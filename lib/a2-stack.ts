import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class LC5274Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const leiBucket = new s3.Bucket(this, 'LC5274Bucket', {
      bucketName: `lc5274-first-bucket-${this.account}`,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const leiTable = new dynamodb.Table(this, 'LC5274Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'LC5274-MyTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const leiLambda = new lambda.Function(this, 'LC5274Lambda', {
      functionName: 'LC5274-MyLambda',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('LC5274 Lambda invoked!');
          console.log('Student ID: 5274');
          console.log('Event:', JSON.stringify(event, null, 2));
          return { 
            statusCode: 200, 
            body: JSON.stringify({
              message: 'Hello from LC5274!',
              studentId: '5274',
              timestamp: new Date().toISOString()
            })
          };
        }
      `),
      environment: {
        BUCKET_NAME: leiBucket.bucketName,
        TABLE_NAME: leiTable.tableName,
        STUDENT_ID: '5274',
      },
    });

    // Grant the Lambda function read/write permissions to the S3 bucket and the DynamoDB table
    leiBucket.grantReadWrite(leiLambda);
    leiTable.grantReadWriteData(leiLambda);

    // Output the resource names for reference
    new cdk.CfnOutput(this, 'LC5274BucketName', {
      value: leiBucket.bucketName,
      description: 'Name of the S3 bucket created for LC5274',
    });

    new cdk.CfnOutput(this, 'LC5274LambdaFunctionName', {
      value: leiLambda.functionName,
      description: 'Name of the Lambda function created for LC5274',
    });

    new cdk.CfnOutput(this, 'LC5274TableName', {
      value: leiTable.tableName,
      description: 'Name of the DynamoDB table created for LC5274',
    });
  }
}
