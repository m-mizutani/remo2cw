import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as path from 'path';

export interface property extends cdk.StackProps {
  remoAPItoken: string;
  metricsNamespace?: string;
}

interface remoMetric {
  key: string;
  name: string;
}

const remoMetrics : Array<remoMetric> = [
  {
		key:  "hu",
		name: "humidity",
	},
	{
		key:  "te",
		name: "temperature",
	},
	{
		key:  "li",
		name: "illumination",
	},
	{
		key:  "mo",
		name: "movement",
	},
];


export class Remo2CwStack extends cdk.Stack {
  readonly reader: lambda.Function;
  readonly metrics: { [key:string] : cloudwatch.Metric };

  constructor(scope: cdk.Construct, id: string, props: property) {
    super(scope, id, props);

    const buildPath = lambda.Code.fromAsset(path.join(__dirname, '../build'));
    const envVars = {
      REMO_API_TOKEN: props.remoAPItoken,
      METRICS_NAMESPACE: props.metricsNamespace || "NatureRemo",
    }

    this.reader = new lambda.Function(this, 'reader', {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'reader',
      code: buildPath,
      environment: envVars,
    });

    new events.Rule(this, 'periodicReaderInvocation', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      targets: [new eventsTargets.LambdaFunction(this.reader)],
    });

    cloudwatch.Metric.grantPutMetricData(this.reader);
  }
}
