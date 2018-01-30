import { module } from 'angular';

import { PIPELINE_CONFIG_PROVIDER, PipelineConfigProvider } from 'core/pipeline/config/pipelineConfigProvider';

export const UPDATE_GATEKEEPER_POLICIES_STAGE = 'spinnaker.core.pipeline.stage.updateGatekeeperPoliciesStage';
module(UPDATE_GATEKEEPER_POLICIES_STAGE, [
  PIPELINE_CONFIG_PROVIDER,
]).config((pipelineConfigProvider: PipelineConfigProvider) => {
    pipelineConfigProvider.registerStage({
      key: 'updateGatekeeperPolicies',
      label: 'Update Gatekeeper Policies',
      useBaseProvider: true,
      description: 'Update Gatekeeper policies to allow this application to fetch a Vault token that allows it to fetch its Vault secrets',
    });
  });

