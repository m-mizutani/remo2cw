# remo2cw

CDK stack to put metrics of [Nature Remo](https://nature.global/) devices to Amazon CloudWatch Metrics by Lambda Function.

## Prerequisite

- npm >= 6.14.7
- aws-cdk >= 1.74.0
- go >= 1.15
- GNU make >= 3.81

## Usage

At first, take your API token from [Nature Remo site](https://home.nature.global/home).

Then you can deploy CDK stack with 

```sh
$ git clone https://github.com/m-mizutani/remo2cw.git
$ cd remo2cw
$ make deploy
```

## License

MIT Licence