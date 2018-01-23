'use strict';

describe('dcosServerGroupVaultSecretsController', function() {

  var controller;
  var scope;

  beforeEach(
    window.module(
      require('./vaultSecrets.controller.js').name
    )
  );

  beforeEach(window.inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();

    scope.command = {};
    scope.command.secrets1 = [];
    scope.command.viewModel = {};

    controller = $controller('dcosServerGroupVaultSecretsController', {
      $scope: scope,
    });
  }));

  describe('Environment Variables', function () {

    beforeEach(function() {
      scope.command.env = {};
      scope.command.secrets1 = [];
      scope.command.viewModel.secrets = [];
    });

    it('Environment Variables spec 1', function () {
      controller.addEnvironmentVariable();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
    });

    it('Environment Variables spec 2', function () {
      var index = 0;

      controller.addEnvironmentVariable();

      scope.command.viewModel.secrets[index].name = 'Key';
      scope.command.viewModel.secrets[index].value = 'Value';
      scope.command.viewModel.secrets[index].rawValue = scope.command.viewModel.secrets[index].value;
      scope.command.viewModel.secrets[index].isSecret = true;

      controller.addSecret(index);
      controller.synchronize();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
      expect(scope.command.env['Key']).toEqual({secret: 'secret0'});

      expect(Object.keys(scope.command.secrets1).length).toEqual(1);
    });

    it('Environment Variables spec 3', function () {
      var index = 0;

      controller.addEnvironmentVariable();

      scope.command.viewModel.secrets[index].name = 'Key';
      scope.command.viewModel.secrets[index].value = 'Value';
      scope.command.viewModel.secrets[index].rawValue = scope.command.viewModel.secrets[index].value;
      scope.command.viewModel.secrets[index].isSecret = true;

      controller.addSecret(index);
      controller.removeSecret(index);
      controller.synchronize();

      expect(scope.command.viewModel.secrets.length).toEqual(1);
      expect(scope.command.env['Key']).toEqual(null);

      expect(Object.keys(scope.command.secrets1).length).toEqual(0);
    });

    it('Environment Variables spec 4', function () {
      var index = 0;

      controller.addEnvironmentVariable();

      scope.command.viewModel.secrets[index].name = 'Key';
      scope.command.viewModel.secrets[index].value = 'oldValue';
      scope.command.viewModel.secrets[index].rawValue = 'newValue';

      controller.updateValue(index);

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
