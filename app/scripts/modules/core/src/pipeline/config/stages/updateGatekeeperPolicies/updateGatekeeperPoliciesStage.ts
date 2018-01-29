import { IController, IScope, module } from 'angular';

import { JSON_UTILITY_SERVICE, JsonUtilityService } from 'core/utils/json/json.utility.service';
import { PIPELINE_CONFIG_PROVIDER, PipelineConfigProvider } from 'core/pipeline/config/pipelineConfigProvider';
import { ExecutionDetailsTasks } from '../core';
import { SecretManagementService } from '@spinnaker/core';

import { UpdateGatekeeperPoliciesExecutionDetails } from './UpdateGatekeeperPoliciesExecutionDetails';
import { UpdateGatekeeperPoliciesExecutionLabel } from './UpdateGatekeeperPoliciesExecutionLabel';

export interface IWebhookStageViewState {
  waitForCompletion?: boolean;
  statusUrlResolution: string;
}

export interface IWebhookStageCommand {
  errorMessage?: string;
  invalid?: boolean;
  payloadJSON: string;
}

export interface ICustomHeader {
  key: string;
  value: string;
}

export interface IWebhookParameter {
  name: string;
  label: string;
  description?: string;
  type: string;
  defaultValue?: string;
}

export class UpdateGatekeeperPoliciesStage implements IController {
  public command: IWebhookStageCommand;
  public viewState: IWebhookStageViewState;
  public preconfiguredProperties: string[];
  public noUserConfigurableFields: boolean;
  public parameters: IWebhookParameter[] = [];

  constructor(public stage: any,
              private jsonUtilityService: JsonUtilityService,
              private pipelineConfig: PipelineConfigProvider,
              private secretManagementService: SecretManagementService,
              private $scope: IScope) {
    'ngInject';

    this.stage.method = 'POST';
    this.stage.payload = this.$scope.command.gatekeeperPolicy;
    this.stage.url = this.secretManagementService.getGatekeeperPolicyUpdateUrl()

    this.viewState = {
      waitForCompletion: this.stage.waitForCompletion || false,
      statusUrlResolution: this.stage.statusUrlResolution || 'getMethod'
    };

    this.command = {
      payloadJSON: this.jsonUtilityService.makeSortedStringFromObject(this.stage.payload || {}),
    };

    this.stage.statusUrlResolution = this.viewState.statusUrlResolution;

    const stageConfig = this.pipelineConfig.getStageConfig(this.stage);
    if (stageConfig && stageConfig.configuration) {
      this.preconfiguredProperties = stageConfig.configuration.preconfiguredProperties || [];
      this.noUserConfigurableFields = stageConfig.configuration.noUserConfigurableFields;
      this.viewState.waitForCompletion = stageConfig.configuration.waitForCompletion || this.viewState.waitForCompletion;
      this.parameters = stageConfig.configuration.parameters || [];
    }

    if (this.parameters.length && !this.stage.parameterValues) {
      this.stage.parameterValues = {};
    }

    this.parameters.forEach((config: any) => {
      if (!(config.name in this.stage.parameterValues) && (config.defaultValue !== null)) {
        this.stage.parameterValues[config.name] = config.defaultValue;
      }
    });
  }

  public waitForCompletionChanged(): void {
    this.stage.waitForCompletion = this.viewState.waitForCompletion;
  }

  public statusUrlResolutionChanged(): void {
    this.stage.statusUrlResolution = this.viewState.statusUrlResolution;
  }

  public displayField(field: string): boolean {
    return !this.preconfiguredProperties || !this.preconfiguredProperties.some(property => property === field);
  }
}

export const UPDATE_GATEKEEPER_POLICIES_STAGE = 'spinnaker.core.pipeline.stage.updateGatekeeperPolicies';
module(UPDATE_GATEKEEPER_POLICIES_STAGE, [
  JSON_UTILITY_SERVICE,
  PIPELINE_CONFIG_PROVIDER,
]).config((pipelineConfigProvider: PipelineConfigProvider) => {
    pipelineConfigProvider.registerStage({
      useBaseProvider: true,
      executionLabelComponent: UpdateGatekeeperPoliciesExecutionLabel,
      executionDetailsSections: [ UpdateGatekeeperPoliciesExecutionDetails, ExecutionDetailsTasks ],
      key: 'updateGatekeeperPolicies',
      label: 'Update Gatekeeper Policies',
      description: 'Update Gatekeeper policies to allow this application to fetch a Vault token that allows it to fetch its Vault secrets',
      restartable: true,
      templateUrl: require('./updateGatekeeperPoliciesStage.html'),
      controller: 'UpdateGatekeeperPoliciesStageCtrl',
      controllerAs: '$ctrl',
      strategy: true,
    });
  }).controller('UpdateGatekeeperPoliciesStageCtrl', UpdateGatekeeperPoliciesStage);

