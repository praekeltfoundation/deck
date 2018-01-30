import { module } from 'angular';

import { PIPELINE_CONFIG_PROVIDER, PipelineConfigProvider } from 'core/pipeline/config/pipelineConfigProvider';
import { UpdateGatekeeperPoliciesExecutionDetails } from './UpdateGatekeeperPoliciesExecutionDetails';
import { ExecutionDetailsTasks } from '../core';

export const UPDATE_GATEKEEPER_POLICIES_STAGE = 'spinnaker.core.pipeline.stage.updateGatekeeperPoliciesStage';

module(UPDATE_GATEKEEPER_POLICIES_STAGE, [
  PIPELINE_CONFIG_PROVIDER,
]).config((pipelineConfigProvider: PipelineConfigProvider) => {
    pipelineConfigProvider.registerStage({
      useBaseProvider: true,
      executionDetailsSections: [UpdateGatekeeperPoliciesExecutionDetails, ExecutionDetailsTasks],
      key: 'updateGatekeeperPolicies',
      label: 'Update Gatekeeper Policies',
      description: 'Update Gatekeeper policies to allow this application to fetch a Vault token that allows it to fetch its Vault secrets',
      strategy: true,
    });
  });

