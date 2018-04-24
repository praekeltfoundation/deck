'use strict';

describe('dcosServerGroupVaultSecretsController', function() {
  var controller;
  var scope;

  beforeEach(window.module(require('./vaultSecrets.controller.js').name));

  beforeEach(
    window.inject(function($rootScope, $controller, HttpClientModule) {
      scope = $rootScope.$new();

      scope.command = {};
      scope.command.viewModel.secrets = [];
      scope.command.viewModel = {};

      controller = $controller('dcosServerGroupVaultSecretsController', {
        $scope: scope,
      });
    }),
  );

  describe('Vault Secrets', function() {
    beforeEach(function() {
      scope.command.env = {};
      scope.command.secrets1 = [];
      scope.command.viewModel.secrets = [];
    });

    it('Vault Secrets spec 1', function() {
      controller.addEnvironmentVariable();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
    });

    it('Vault Secrets spec 2', function() {
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
      expect(
        scope.command.env['VAULT_SECRETS'].toEqual({
          id: 'default',
          backend: 'postgresql',
          endpoint: 'database-url.org:0000/postgres',
          vault_path: 'database/creds/postgresql--database-url.org--0000--postgres--readwrite',
          schema: 'postgres',
          policy: 'readwrite',
          set_role: 'test',
        }),
      );

      expect(
        scope.command.env['VAULTKEEPER_CONFIG'].toEqual({
          entry_cmd: 'entry',
          output_path: 'output',
          refresh_interval: 'refresh',
          lease_increment: 'increment',
          renewal_grace: 'grace',
        }),
      );

      expect(scope.command.env['VAULT_ADDR'].toEqual('vault_addr'));
      expect(scope.command.env['GATEKEEPER_ADDR'].toEqual('gatekeeper_addr'));
      expect(scope.command.env['CREDENTIAL_PATH'].toEqual('credential_path'));
    });

    it('Vault Secrets spec 3', function() {
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

    it('Vault Secrets spec 4', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      controller.updatePolicy(index);

      expect(scope.command.viewModel.secrets[index].value).toEqual(scope.command.viewModel.secrets[index].rawValue);
    });

    it('Vault Secrets spec 5', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      scope.secrets.policy = 'newPolicy';

      controller.updateValue(index);

      expect(scope.command.viewModel.secrets[index].policy).toEqual('newPolicy');
    });

    it('Vault Secrets spec 6', function() {
      controller.addSecret();
      controller.removeSecret(0);

      expect(scope.command.viewModel.secrets.length).toEqual(0);
    });

    it('Vault Secrets spec 7', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      expect(scope.command.viewModel.secrets.length).toEqual(1);

      controller.addSecret();

      expect(scope.command.viewModel.secrets.length).toEqual(2);
    });

    it('Vault Secrets spec 8', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      controller.addVaultDockerHost();

      expect(
        scope.command.docker.parameters.indexOf({
          key: 'add-host',
          value: scope.vault.vaultAddress,
        }),
      ).toBeGreaterThan(-1);

      controller.removeVaultDockerHost();
      expect(
        scope.command.docker.parameters.indexOf({
          key: 'add-host',
          value: scope.vault.vaultAddress,
        }),
      ).toEqual(-1);
    });

    it('Vault Secrets spec 9', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      controller.addGatekeeperDockerHost();

      expect(
        scope.command.docker.parameters.indexOf({
          key: 'add-host',
          value: scope.vault.gatekeeperAddress,
        }),
      ).toBeGreaterThan(-1);

      controller.removeGatekeeperDockerHost();
      expect(
        scope.command.docker.parameters.indexOf({
          key: 'add-host',
          value: scope.vault.gatekeeperAddress,
        }),
      ).toEqual(-1);
    });

    it('Vault Secrets spec 10', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      controller.addGatekeeperDockerHost();

      expect(
        scope.command.docker.parameters.indexOf({
          key: 'add-host',
          value: scope.vault.gatekeeperAddress,
        }),
      ).toBeGreaterThan(-1);

      controller.removeGatekeeperDockerHost();
      expect(
        scope.command.docker.parameters.indexOf({
          key: 'add-host',
          value: scope.vault.gatekeeperAddress,
        }),
      ).toEqual(-1);
    });
  });
});
