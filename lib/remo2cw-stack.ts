import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as path from 'path';
import * as https from 'https';
import { Resolver } from 'dns';
export interface property extends cdk.StackProps {
  remoAPItoken: string;
  metricsNamespace?: string;
  dashboardName?:string;
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
  #props: property;

  constructor(scope: cdk.Construct, id: string, props: property) {
    super(scope, id, props);

    const buildPath = lambda.Code.fromAsset(path.join(__dirname, '../build'));
    const envVars = {
      REMO_API_TOKEN: props.remoAPItoken,
      METRICS_NAMESPACE: props.metricsNamespace || "NatureRemo",
    }
    this.#props = props;

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

    // Build dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'NatureRemoDashBoard', {
      dashboardName: props.dashboardName || "NatureRemoDashBoard",
    })

    getRemoDevices(props.remoAPItoken, (devices: Array<remoDevice>) => {
      remoMetrics.forEach(metric => {
        const widget = new cloudwatch.GraphWidget({
          height: 6,
          width: 12,
          title: metric.name,
        });

        devices.forEach(device => {
          const cwMetric = new cloudwatch.Metric({
            metricName: metric.name,
            namespace: envVars.METRICS_NAMESPACE,
            label: `${device.name} (${device.id})`,
            dimensions: {
              "Device": device.id,
            }
          })
          widget.addLeftMetric(cwMetric);
        })

        dashboard.addWidgets(widget);
      })
    });
  }
}


interface remoDevice {
  name: string;
  id: string;
  newest_events: {[key: string]: remoEvent},
};

interface remoEvent {
  val: number;
  created_at: string;
}

function getRemoDevices(apiToken: string, callback: (devices: Array<remoDevice>) => void) {
  https.get('https://api.nature.global/1/devices', {
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + apiToken,
    },
  }, (res)=> {
    var data = '';
    res.on('data', (d) => {
      data  += d as string;
    })
    res.on('end', () => {
      if (res.statusCode != 200) {
        throw Error(`Failed to retrieve Remo device list, code ${res.statusCode}, ${data}`);
      }

      const resp = JSON.parse(data);
      console.log(resp);
      callback(resp as Array<remoDevice>)
    })
  }).on('error', (e) => {
    console.log('Failed to connect to Nature Remo API: ', e);
  })
}