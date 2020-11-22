# remo2cw

CDK stack to put metrics of [Nature Remo](https://nature.global/) devices to Amazon CloudWatch Metrics by Lambda Function.

## Prerequisite

- Tools
  - npm >= 6.14.7
  - aws-cdk >= 1.74.0
  - go >= 1.15
  - GNU make >= 3.81
- Credentials
  - Nature Remo API token from [Nature Remo site](https://home.nature.global/home)
  - AWS credential that can deploy CDK stack. See [guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for more detail

## Usage

```sh
$ git clone https://github.com/m-mizutani/remo2cw.git
$ cd remo2cw
$ export REMO_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxx
$ make deploy # with AWS credential
```

## License

MIT Licence
