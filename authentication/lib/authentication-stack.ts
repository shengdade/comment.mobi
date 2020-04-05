import * as cdk from '@aws-cdk/core';
import * as auth from '../lib/authentication';

export class AuthenticationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new auth.Authentication(this, 'Authentication');
  }
}
