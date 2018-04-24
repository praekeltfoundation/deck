import { IPromise, module, IQService } from 'angular';

import { API } from 'core/api/ApiService';

export class SecretManagementService {
  constructor(private $q: IQService) {
    'ngInject';
  }

  public getVaultPolicies(): IPromise<string> {
    const acls: IPromise<string> = API.one('secrets')
      .one('vaultpolicies')
      .get();
    if (!acls) {
      return this.$q.reject('An error occurred when retrieving the list of Vault policies for Spinnaker applications.');
    }
    return acls;
  }

  public getRoles(backend: string = null): IPromise<string> {
    const roles: IPromise<string> = API.one('secrets')
      .one(backend)
      .one('roles')
      .get();

    if (!roles) {
      return this.$q.reject('An error occurred when retrieving backend policies for ' + backend + '.');
    }
    return roles;
  }

  public addGatekeeperPolicies(newPolicies: any): IPromise<string> {
    const gkPolicies: IPromise<string> = API.one('secrets')
      .one('gatekeeper')
      .one('policies')
      .get();
    let merged = {};
    return gkPolicies.then(
      resp => {
        const obj = JSON.stringify(resp);
        const current = JSON.parse(obj)['data'];
        const npolicies = newPolicies;
        merged = angular.merge(current, npolicies);
        return this.updateGatekeeperPolicies(JSON.stringify(merged));
      },
      () => {
        return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
      },
    );
  }

  public removeGatekeeperPolicies(removedPolicies: any): IPromise<string> {
    const gkPolicies: IPromise<string> = API.one('secrets')
      .one('gatekeeper')
      .one('policies')
      .get();
    let current = JSON.parse('{}');
    return gkPolicies.then(
      resp => {
        const obj = JSON.stringify(resp);
        current = JSON.parse(obj)['data'];
        const rpolicies = removedPolicies;
        Object.keys(rpolicies).forEach((key: string) => {
          // If key exists, we remove it
          delete current[key];
        });
        return this.updateGatekeeperPolicies(JSON.stringify(current));
      },
      () => {
        return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
      },
    );
  }

  public getGatekeeperPolicyUpdateUrl(): string {
    return API.baseUrl + '/secrets/gatekeeper/policies';
  }

  private updateGatekeeperPolicies(newPolicies: any): IPromise<string> {
    const response: IPromise<string> = API.one('secrets')
      .one('gatekeeper')
      .one('policies')
      .post(newPolicies);
    if (!response) {
      return this.$q.reject('An error occurred when attempting to update the Gatekeeper policies in Vault.');
    }
    return response;
  }

  public reloadGatekeeperPolicies(): IPromise<string> {
    const response: IPromise<string> = API.one('secrets')
      .one('gatekeeper')
      .one('policies')
      .one('reload')
      .post();
    if (!response) {
      return this.$q.reject('An error occurred when attempting to get Gatekeeper to reload its policies from Vault.');
    }
    return response;
  }
}

export const SECRET_MANAGEMENT_SERVICE = 'spinnaker.core.secretManagement.service';
module(SECRET_MANAGEMENT_SERVICE, []).factory(
  'secretManagementService',
  ($q: IQService) => new SecretManagementService($q),
);
