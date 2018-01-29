import { IController, IScope, module } from 'angular';
import { StateParams } from '@uirouter/angularjs';
// import { SecretManagementService } from '@spinnaker/core';
import { get } from 'lodash';

import {
  EXECUTION_DETAILS_SECTION_SERVICE,
  ExecutionDetailsSectionService
} from 'core/pipeline/details/executionDetailsSection.service';

export class UpdateGatekeeperPoliciesExecutionDetailsCtrl implements IController {
  public configSections = ['updateGatekeeperPoliciesConfig', 'taskStatus'];
  public detailsSection: string;
  public failureMessage: string;
  public progressMessage: string;
  public stage: any;

  constructor(private $stateParams: StateParams,
              private executionDetailsSectionService: ExecutionDetailsSectionService,
  //            private secretManagementService: SecretManagementService,
              private $scope: IScope) {
    'ngInject';
    this.initialize();
    this.$scope.$on('$stateChangeSuccess', () => this.initialize());
  }

  public initialized(): void {
    this.stage = this.$scope.stage;
    this.detailsSection = get<string>(this.$stateParams, 'details', '');
    this.failureMessage = this.getFailureMessage();
    this.progressMessage = this.getProgressMessage();
  }

  private getProgressMessage(): string {
    const context = this.stage.context || {},
      buildInfo = context.buildInfo || {};
    return buildInfo.progressMessage;
  }

  private getFailureMessage(): string {
    let failureMessage = this.stage.failureMessage;
    const context = this.stage.context || {},
      buildInfo = context.buildInfo || {};
    if (buildInfo.status === 'TERMINAL') {
        failureMessage = `Gatekeeper Policy Update failed: ${buildInfo.reason}`;
    }
    return failureMessage;
  }

  private initialize(): void {
    this.executionDetailsSectionService.synchronizeSection(this.configSections, () => this.initialized());
  }
}

export const UPDATE_GATEKEEPER_POLICIES_EXECUTION_DETAILS_CONTROLLER = 'spinnaker.core.pipeline.stage.updateGatekeeperPolicies.executionDetails.controller';
module(UPDATE_GATEKEEPER_POLICIES_EXECUTION_DETAILS_CONTROLLER, [
  EXECUTION_DETAILS_SECTION_SERVICE,
]).controller('UpdateGatekeeperPoliciesExecutionDetailsCtrl', UpdateGatekeeperPoliciesExecutionDetailsCtrl);
