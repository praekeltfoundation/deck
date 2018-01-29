'use strict';

const angular = require('angular');

import { StageConstants } from '@spinnaker/core';
import { SECRET_MANAGEMENT_SERVICE, SecretMangementService } from '@spinnaker/core';

module.exports = angular.module('spinnaker.dcos.pipeline.stage.updateGatekeeperPolicyStage', [SECRET_MANAGEMENT_SERVICE])
  .config(function(pipelineConfigProvider) {
    pipelineConfigProvider.registerStage({
      provides: 'updateGatekeeperPolicies',
      alias: 'updateGatekeeperPolicies',
      cloudProvider: 'dcos',
      templateUrl: require('./updateGatekeeperPoliciesStage.html'),
      executionStepLabelUrl: require('./updateGatekeeperPoliciesStepLabel.html'),
      validators: [],
    });
  }).controller('dcosUpdateGatekeeperPoliciesStageCtrl', function($scope, accountService, secretManagementService) {

    let stage = $scope.stage;

    $scope.state = {
      accounts: false,
      regionsLoaded: false
    };

    accountService.listAccounts('dcos').then(function (accounts) {
      $scope.accounts = accounts;
      $scope.state.accounts = true;
    });

    $scope.targets = StageConstants.TARGET_LIST;

    stage.regions = stage.regions || [];
    stage.cloudProvider = 'dcos';

    if (!stage.credentials && $scope.application.defaultCredentials.dcos) {
      stage.credentials = $scope.application.defaultCredentials.dcos;
    }
    if (!stage.regions.length && $scope.application.defaultRegions.dcos) {
      stage.regions.push($scope.application.defaultRegions.dcos);
    }

    if (!stage.target) {
      stage.target = $scope.targets[0].val;
    }

  });
