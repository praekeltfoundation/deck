'use strict';

import { HttpClientModule } from '@angular/common/http';

describe('dcosServerGroupVaultSecretsController', function() {

  var controller;
  var scope;

  beforeEach(
    window.module(
      require('./vaultSecrets.controller.js').name
    )
  );

  beforeEach(window.inject(function ($rootScope, $controller, HttpClientModule) {
    scope = $rootScope.$new();

    scope.command = {};
    scope.command.viewModel.secrets = [];
    scope.command.viewModel = {};

    controller = $controller('dcosServerGroupVaultSecretsController', {
      $scope: scope,
    });
  }));

  describe('Vault Secrets', function () {

    beforeEach(function() {
      scope.command.env = {};
      scope.command.secrets1 = [];
      scope.command.viewModel.secrets = [];
    });

    it('Vault Secrets spec 1', function () {
      controller.addEnvironmentVariable();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
    });

    it('Vault Secrets spec 2', function () {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      scope.vaultkeeper.entrypoint = true;
      scope.vaultkeeper.entrypoint = 'entry';
      scope.vaultkeeper.outputPath = 'output';
      scope.vaultkeeper.refresh_interval = 'refresh';
      scope.vaultkeeper.lease_increment = 'increment';
      scope.vaultkeeper.renewal_grace = 'grace';

      scope.command.env['VAULT_ADDR'] = 'vault_addr';
      scope.command.env['GATEKEEPER_ADDR'] = 'gatekeeper_addr';
      scope.command.env['CREDENTIAL_PATH'] = 'credential_path';

      controller.synchronize();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
      expect(scope.command.env['VAULT_SECRETS'].toEqual({
        'id': 'default',
        'backend': 'postgresql',
        'endpoint': 'database-url.org:0000/postgres',
        'vault_path': 'database/creds/postgresql--database-url.org--0000--postgres--readwrite',
        'schema': 'postgres',
        'policy': 'readwrite',
        'set_role': 'test',
      }));

      expect(scope.command.env['VAULTKEEPER_CONFIG'].toEqual({
        'entry_cmd': 'entry',
        'output_path': 'output',
        'refresh_interval': 'refresh',
        'lease_increment': 'increment',
        'renewal_grace': 'grace',
      }));

      expect(scope.command.env['VAULT_ADDR'].toEqual('vault_addr'));
      expect(scope.command.env['GATEKEEPER_ADDR'].toEqual('gatekeeper_addr'));
      expect(scope.command.env['CREDENTIAL_PATH'].toEqual('credential_path'));
    });

    it('Vault Secrets spec 3', function () {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      controller.removeSecret();
      controller.synchronize();

      expect(scope.command.viewModel.secrets.length).toEqual(0);
    });

    it('Vault Secrets spec 4', function () {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      controller.updatePolicy(index);

      expect(scope.command.viewModel.secrets[index].value).toEqual(scope.command.viewModel.secrets[index].rawValue);
    });

    it('Environment Variables spec 5', function () {
      var index = 0;

      controller.addEnvironmentVariable();

      scope.command.viewModel.secrets[index].name = 'Key';
      scope.command.viewModel.secrets[index].value = 'oldValue';
      scope.command.viewModel.secrets[index].rawValue = scope.command.viewModel.secrets[index].value;
      scope.command.viewModel.secrets[index].isSecret = true;

      controller.addSecret(index);
      controller.updateValue(index);

      expect(scope.command.secrets1['secret' + index].source).toEqual(scope.command.viewModel.secrets[index].rawValue);
    });

    it('Environment Variables spec 6', function () {
      controller.addEnvironmentVariable();
      controller.removeEnvironmentVariable(0);

      expect(scope.command.viewModel.secrets.length).toEqual(0);
    });

    it('Environment Variables spec 7', function () {
      var index = 0;

      controller.addEnvironmentVariable();

      scope.command.viewModel.secrets[index].name = 'Key';
      scope.command.viewModel.secrets[index].value = 'oldValue';
      scope.command.viewModel.secrets[index].rawValue = scope.command.viewModel.secrets[index].value;
      scope.command.viewModel.secrets[index].isSecret = false;

      controller.updateSecret(index, scope.command.viewModel.secrets[index].isSecret);

      expect(scope.command.viewModel.secrets.length).toEqual(1);
      expect(Object.keys(scope.command.secrets1).length).toEqual(1);

      scope.command.viewModel.secrets[index].isSecret = true;

      controller.updateSecret(index, scope.command.viewModel.secrets[index].isSecret);

      expect(scope.command.viewModel.secrets.length).toEqual(1);
      expect(Object.keys(scope.command.secrets1).length).toEqual(0);

    });
  });
});
