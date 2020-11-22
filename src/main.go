package main

import (
	"context"

	"github.com/Netflix/go-env"
	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/xerrors"
)

// Arguments is input of Handler
type Arguments struct {
	RemoAPIToken     string `env:"REMO_API_TOKEN"`
	MetricsNamespace string `env:"METRICS_NAMESPACE"`
	Region           string `env:"AWS_REGION"`
}

// Handler is a main procedure
func Handler(args *Arguments) error {
	if args.MetricsNamespace == "" {
		args.MetricsNamespace = "NatureRemo"
	}
	if args.Region == "" {
		return xerrors.New("AWS_REGION is not set")
	}
	if args.RemoAPIToken == "" {
		return xerrors.New("REMO_API_TOKEN is not set")
	}

	devices, err := getRemoDevices(args.RemoAPIToken)
	if err != nil {
		return err
	}

	if err := putMetrics(args.Region, args.MetricsNamespace, devices); err != nil {
		return err
	}
	return nil
}

func main() {
	lambda.Start(func(ctx context.Context) error {
		var args Arguments
		if _, err := env.UnmarshalFromEnviron(&args); err != nil {
			return xerrors.Errorf("Init arguments: %w", err)
		}

		if err := Handler(&args); err != nil {
			return err
		}

		return nil
	})
}
