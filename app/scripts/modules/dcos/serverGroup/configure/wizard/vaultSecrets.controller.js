'use strict';

import { SECRET_MANAGEMENT_SERVICE, SecretMangementService } from '@spinnaker/core';

const angular = require('angular');

// TODO: Make these configurable
const BACKENDS = ['aws','rabbitmq','database'];

module.exports = angular.module('spinnaker.dcos.serverGroup.configure.vaultSecrets', [SECRET_MANAGEMENT_SERVICE
]).controller('dcosServerGroupVaultSecretsController', function($scope, secretManagementService) {

    $scope.command.viewModel.secrets = [];
    $scope.command.viewModel.backendsList = BACKENDS;
    $scope.command.viewModel.secrets.policies = [];

    this.isEnvironmentValid = function(env) {
      return !(typeof env === 'string' || env instanceof String);
    };

    // init from the model (this is a null operation for now)
    if ($scope.command.secrets && this.isEnvironmentValid($scope.command.secrets)) {
      Object.keys($scope.command.secrets).forEach((key) => {
        let val = $scope.command.secrets[key];

        $scope.command.viewModel.secrets.push({
          name: key,
          backend: null,
          policy: null,
          value: val,
          setRole: null
        });
      });
    }

    this.getPolicies = function(index) {
      var backend = $scope.command.viewModel.secrets[index].backend;
      secretManagementService.getRoles(backend).then(function successCallback(response) {
        console.info('Success!');
        console.info(JSON.stringify(response,null,'    '));
        $scope.command.viewModel.secrets.policies = response['data']['keys'];
      }, function errorCallback(response) {
        console.info('Failure!');
        $scope.command.error = response;
        console.info(JSON.stringify(response,null,'    '));
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    };

    this.addSecret = function() {
      if (!this.isEnvironmentValid($scope.command.secrets)) {
        $scope.command.secrets = {};
      }

      $scope.command.viewModel.secrets.push({
        name: null,
        value: null,
        backend: null,
        policy: null,
        setRole: null
      });
    };

    this.removeSecret = function(index) {
      $scope.command.viewModel.secrets.splice(index, 1);
      this.synchronize();
    };

    this.updatePolicy = function(index) {
      $scope.command.viewModel.secrets[index].policy = $scope.command.viewModel.secrets[index].policy;
    };

    this.synchronize = () => {
      let allNames = $scope.command.viewModel.secrets.map((item) => item.name);
      // $scope.command.secrets = {};
      var sec = [];
      $scope.command.viewModel.secrets.forEach((item) => {
        // split the policy into its constituents
        if (item.name && item.policy && item.backend) {
          var s = item.policy.split('--');
          sec.push({
            'id': item.name,
            'backend': item.backend,
            'endpoint': s[0] + ':' + s[1] + '/' + s[2],
            'vault_path': item.backend + '/creds/' + item.policy,
            'schema': s[3],
            'policy': item.policy,
            'set_role': item.setRole,
          });
        console.info(sec);
        }
        item.checkUnique = allNames.filter((name) => item.name !== name);
        item.requiresSetRole = item.policy && (item.policy.toLowerCase().indexOf('postgres') >= 0);
      });
      $scope.command.env['VAULT_SECRETS'] = JSON.stringify(sec);
      $scope.command.env['VAULTKEEPER_CONFIG'] = $scope.vaultkeeperConfig;
      console.info($scope.command.env['VAULTKEEPER_CONFIG']);
      this.updateGatekeeperPolicies();
    };
    $scope.$watch(() => JSON.stringify($scope.command.viewModel.secrets), this.synchronize);

    // We need to pre-set a couple of Vault ACL policies for each dynamic secret.
    this.updateGatekeeperPolicies = () => {      
      var appname = $scope.command.application + '*';
      var vaultPolicies = ['default'];
      $scope.command.viewModel.secrets.forEach((item) => {
        if (item.name && item.policy && item.backend) {
            vaultPolicies.push('spinnaker-app-' + item.policy);
        }
      });
      var newPolicy = {
        [appname]: {
          'policies': vaultPolicies,
          'ttl': 6000,
      }
    };
    console.info(newPolicy);
    $scope.command.gatekeeperPolicy = newPolicy;
    };
  });
