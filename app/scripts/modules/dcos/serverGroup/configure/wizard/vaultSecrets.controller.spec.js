'use strict';

describe('dcosServerGroupVaultSecretsController', function() {
  var controller;
  var scope;

  beforeEach(window.module(require('./vaultSecrets.controller.js').name));

  beforeEach(
    window.inject(function($rootScope, $controller) {
      scope = $rootScope.$new();

      scope.command = {};
      scope.command.env = {};
      scope.command.viewModel = {};
      scope.command.viewModel.secrets = [];
      scope.vaultkeeper = {};
      scope.vault = {};
      scope.command.docker = {};
      scope.command.docker.parameters = [];
      scope.secrets = {};

      controller = $controller('dcosServerGroupVaultSecretsController', {
        $scope: scope,
      });
    }),
  );

  describe('Vault Secrets', function() {
    beforeEach(function() {
      scope.command.env = {};
      scope.command.viewModel.secrets = [];
    });

    it('Vault Secrets spec 1', function() {
      controller.addSecret();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
    });

    it('Vault Secrets spec 2', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'database';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      scope.vaultkeeper.entrypoint = 'entry';
      scope.vaultkeeper.outputPath = 'output';
      scope.vaultkeeper.refresh_interval = 'refresh';
      scope.vaultkeeper.lease_increment = 'increment';
      scope.vaultkeeper.renewal_grace = 'grace';

      scope.vault.vaultAddress = 'vault_addr';
      scope.vault.gatekeeperAddress = 'gatekeeper_addr';
      scope.vault.credentialPath = 'credential_path';

      controller.synchronize();

      expect(scope.command.env['VAULT_SECRETS']).toEqual(
        JSON.stringify([
          {
            id: 'default',
            backend: 'database',
            endpoint: 'database-url.org:0000/postgres',
            vault_path: 'database/creds/postgresql--database-url.org--0000--postgres--readwrite',
            schema: 'postgres',
            policy: 'postgresql--database-url.org--0000--postgres--readwrite',
            set_role: 'test',
          },
        ]),
      );

      expect(scope.command.env['VAULTKEEPER_CONFIG']).toEqual(
        JSON.stringify({
          entry_cmd: 'entry',
          output_path: 'output',
          refresh_interval: 'refresh',
          lease_increment: 'increment',
          renewal_grace: 'grace',
        }),
      );

      expect(scope.command.env['VAULT_ADDR']).toEqual('vault_addr');
      expect(scope.command.env['GATEKEEPER_ADDR']).toEqual('gatekeeper_addr');
      expect(scope.command.env['CREDENTIAL_PATH']).toEqual('credential_path');

      expect(scope.command.viewModel.secrets.length).toEqual(1);
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
      scope.secrets.policy = 'testpolicy';

      controller.updatePolicy(index);

      expect(scope.command.viewModel.secrets[index].policy).toEqual('testpolicy');
    });

    it('Vault Secrets spec 5', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      scope.secrets.policy = 'newPolicy';

      controller.updatePolicy(index);

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

      scope.vault.vaultAddress = 'vault_addr';
      scope.vault.gatekeeperAddress = 'gatekeeper_addr';
      scope.vault.credentialPath = 'credential_path';

      scope.vault.addVaultDockerHost = true;
      controller.addVaultDockerHost();

      expect(scope.command.docker.parameters).toContain({
        key: 'add-host',
        value: scope.vault.vaultAddress,
      });

      scope.vault.addVaultDockerHost = false;
      controller.addVaultDockerHost();

      expect(
        scope.command.docker.parameters.includes({
          key: 'add-host',
          value: scope.vault.vaultAddress,
        }),
      ).toBeFalsy();
    });

    it('Vault Secrets spec 9', function() {
      var index = 0;

      controller.addSecret();

      scope.command.viewModel.secrets[index].name = 'default';
      scope.command.viewModel.secrets[index].backend = 'postgresql';
      scope.command.viewModel.secrets[index].policy = 'postgresql--database-url.org--0000--postgres--readwrite';
      scope.command.viewModel.secrets[index].setRole = 'test';

      scope.vault.vaultAddress = 'vault_addr';
      scope.vault.gatekeeperAddress = 'gatekeeper_addr';
      scope.vault.credentialPath = 'credential_path';

      scope.vault.addGatekeeperDockerHost = true;
      controller.addGatekeeperDockerHost();

      expect(scope.command.docker.parameters).toContain({
        key: 'add-host',
        value: scope.vault.gatekeeperAddress,
      });

      scope.vault.addGatekeeperDockerHost = false;
      controller.addGatekeeperDockerHost();

      expect(
        scope.command.docker.parameters.includes({
          key: 'add-host',
          value: scope.vault.gatekeeperAddress,
        }),
      ).toBeFalsy();
    });
  });
});
