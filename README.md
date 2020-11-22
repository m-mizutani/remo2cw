# remo2cw

CDK stack to put metrics of [Nature Remo](https://nature.global/) devices to Amazon CloudWatch Metrics by Lambda Function.

![dashboard](https://user-images.githubusercontent.com/605953/99896375-6fc78380-2cd3-11eb-8e85-65cdb025dde2.png)

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

## Author

mizutani (mizutani@hey.com)

## License

MIT Licence
