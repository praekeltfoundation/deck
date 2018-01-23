import { module } from 'angular';

import { PIPELINE_CONFIG_PROVIDER, PipelineConfigProvider } from 'core/pipeline/config/pipelineConfigProvider';
import { ExecutionDetailsTasks } from '../core';
import { UpdateGatekeeperPoliciesExecutionDetails } from './UpdateGatekeeperPoliciesExecutionDetails';

export const UPDATE_GATEKEEPER_POLICIES = 'spinnaker.core.pipeline.stage.updateGatekeeperPolicies';

module(UPDATE_GATEKEEPER_POLICIES, [
  PIPELINE_CONFIG_PROVIDER,
])
  .config((pipelineConfigProvider: PipelineConfigProvider) => {
    pipelineConfigProvider.registerStage({
      executionDetailsSections: [UpdateGatekeeperPoliciesExecutionDetails, ExecutionDetailsTasks],
      useBaseProvider: true,
      key: 'updateGatekeeperPolicies',
      label: 'Update Gatekeeper policies',
      description: 'Update Gatekeeper policies to allow this application to fetch a Vault token that allows it to fetch its Vault secrets',
      strategy: true,
    });
  });

