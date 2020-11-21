#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Remo2CwStack } from '../lib/remo2cw-stack';

const app = new cdk.App();
new Remo2CwStack(app, 'Remo2CwStack');
