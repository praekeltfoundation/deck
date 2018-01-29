import * as React from 'react';

import { StageExecutionLogs, StageFailureMessage } from 'core/pipeline/details';
import { ExecutionDetailsSection, IExecutionDetailsSectionProps } from 'core/pipeline/config/stages/core';

export function UpdateGatekeeperPoliciesExecutionDetails(props: IExecutionDetailsSectionProps) {
  return (
    <ExecutionDetailsSection name={props.name} current={props.current}>
      <StageFailureMessage stage={props.stage} message={props.stage.failureMessage} />
      <StageExecutionLogs stage={props.stage} />
    </ExecutionDetailsSection>
  );
};

export namespace UpdateGatekeeperPoliciesExecutionDetails {
  export const title = 'updateGatekeeperPoliciesConfig';
}
