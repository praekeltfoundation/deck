import * as React from 'react';

import { AsgActionExecutionDetailsSection, IExecutionDetailsSectionProps } from '../core';

export function UpdateGatekeeperPoliciesExecutionDetails(props: IExecutionDetailsSectionProps) {
  return <AsgActionExecutionDetailsSection {...props} action="Updated"/>
};

export namespace UpdateGatekeeperPoliciesExecutionDetails {
  export const title = 'updateGatekeeperPoliciesConfig';
}
