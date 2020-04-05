#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AuthenticationStack } from '../lib/authentication-stack';

const app = new cdk.App();
new AuthenticationStack(app, 'AuthenticationStack');
