'use strict';

const angular = require('angular');

import { SecretManagementService } from '@spinnaker/core';
import { JSONUtilityService } from '@spinnaker/core';

module.exports = angular.module('spinnaker.dcos.pipeline.stage.updateGatekeeperPoliciesStage', [
])
.config(function(pipelineConfigProvider) {
    pipelineConfigProvider.registerStage({
      provides: 'updateGatekeeperPolicies',
      cloudProvider: 'dcos',
      restartable: true,
      templateUrl: require('./updateGatekeeperPoliciesStage.html'),
      executionDetailsUrl: require('./updateGatekeeperPoliciesExecutionDetails.html'),
      validators: [],
    });
  }).controller('updateGatekeeperPoliciesStageCtrl', function($scope, secretManagementService, jsonUtilityService) {

    $scope.stage.method = 'POST';
    $scope.stage.payload = $scope.command.gatekeeperPolicy;
    $scope.stage.url = secretManagementService.getGatekeeperPolicyUpdateUrl();

    $scope.viewState = {
      waitForCompletion: $scope.stage.waitForCompletion || false,
      statusUrlResolution: $scope.stage.statusUrlResolution || 'getMethod'
    };

    $scope.command = {
      payloadJSON: jsonUtilityService.makeSortedStringFromObject($scope.stage.payload || {}),
    };

    $scope.stage.statusUrlResolution = $scope.viewState.statusUrlResolution;

    // const stageConfig = pipelineConfigProvider.getStageConfig($scope.stage);
    // if (stageConfig && stageConfig.configuration) {
    //  $scope.viewState.waitForCompletion = stageConfig.configuration.waitForCompletion || this.viewState.waitForCompletion;
    //  $scope.parameters = stageConfig.configuration.parameters || [];
    // }

    if ($scope.parameters.length && !$scope.stage.parameterValues) {
      $scope.stage.parameterValues = {};
    }

    $scope.parameters.forEach((config) => {
      if (!(config.name in $scope.stage.parameterValues) && (config.defaultValue !== null)) {
        $scope.stage.parameterValues[config.name] = config.defaultValue;
      }
    });

    this.waitForCompletionChanged = function() {
        $scope.stage.waitForCompletion = $scope.viewState.waitForCompletion;
      };

  });

