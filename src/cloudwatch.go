package main

import (
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cloudwatch"
	"golang.org/x/xerrors"
)

type remoParameter struct {
	Key  string
	Name string
}

var parameters = []*remoParameter{
	// "te" = temperature, "hu" = humidity, "il" = illumination, "mo" = movement.
	{
		Key:  "hu",
		Name: "humidity",
	},
	{
		Key:  "te",
		Name: "temperature",
	},
	{
		Key:  "il",
		Name: "illumination",
	},
	{
		Key:  "mo",
		Name: "movement",
	},
}

func putMetrics(region, namespace string, devices []*remoDevices) error {
	ssn, err := session.NewSession(&aws.Config{
		Region: &region,
	})
	if err != nil {
		return xerrors.Errorf("Creating a session for CloudWatch: %w", err)
	}

	client := cloudwatch.New(ssn)

	var datum []*cloudwatch.MetricDatum
	for _, device := range devices {
		for _, param := range parameters {
			event, ok := device.NewestEvents[param.Key]
			if !ok {
				continue
			}

			datum = append(datum, &cloudwatch.MetricDatum{
				MetricName: aws.String(param.Name),
				Dimensions: []*cloudwatch.Dimension{
					{
						Name:  aws.String("Device"),
						Value: aws.String(device.ID),
					},
				},
				Value: aws.Float64(event.Val),
			})
		}
	}

	input := &cloudwatch.PutMetricDataInput{
		Namespace:  aws.String(namespace),
		MetricData: datum,
	}
	if _, err := client.PutMetricData(input); err != nil {
		log.Println(input)
		return xerrors.Errorf("Putting metric data: %w", err)
	}

	return nil
}
