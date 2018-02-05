
import { IPromise, module, IQService } from 'angular';

import { API_SERVICE, Api } from 'core/api/api.service';


export class SecretManagementService {
  constructor(private API: Api, private $q: IQService) { 'ngInject'; }

  public getVaultPolicies(): IPromise<string> {
    const acls: IPromise<string> = this.API.one('secrets').one('vaultpolicies').get({});
    if (!acls) {
      return this.$q.reject('An error occurred when retrieving the list of Vault policies for Spinnaker applications.');
    }
    return acls;
  }

  public getRoles(backend: string = null): IPromise<string> {
    const roles: IPromise<string> = this.API.one('secrets').one(backend).one('roles').get({});

    if (!roles) {
      return this.$q.reject('An error occurred when retrieving backend policies for ' + backend + '.');
    }
    return roles;
  }

  public addGatekeeperPolicies(newPolicies: any): IPromise<string> {
    const gkPolicies: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').get({});
    let merged = {};
    return gkPolicies.then((data) => {
      const obj = JSON.stringify(data)
      const current = JSON.parse(obj)['data'];
      const npolicies = newPolicies;
      merged = angular.merge(current, npolicies)
      return this.updateGatekeeperPolicies(merged);
    }, () => {
      return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
    });
  }

  public removeGatekeeperPolicies(removedPolicies: any): IPromise<string> {
    const gkPolicies: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').get({});
    let current = JSON.parse('{}');
    return gkPolicies.then((data) => {
      const obj = JSON.stringify(data)
      current = JSON.parse(obj)['data'];
      const rpolicies = removedPolicies;
      Object.keys(rpolicies).forEach((key: string) => {
      // If key exists, we remove it
      delete current[key];
      });
      return this.updateGatekeeperPolicies(current);
    }, () => {
      return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
    });
  }

  public getGatekeeperPolicyUpdateUrl(): string {
    return this.API.baseUrl + '/secrets/gatekeeper/policies';
  }

  private updateGatekeeperPolicies(newPolicies: any): IPromise<string> {
    const response: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').post(newPolicies);
    if (!response) {
      return this.$q.reject('An error occurred when attempting to update the Gatekeeper policies in Vault.');
    }
    return response;
  }

  public reloadGatekeeperPolicies(): IPromise<string> {
    const response: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').one('reload').post();
    if (!response) {
      return this.$q.reject('An error occurred when attempting to get Gatekeeper to reload its policies from Vault.');
    }
    return response
  }
}

export const SECRET_MANAGEMENT_SERVICE = 'spinnaker.core.secretManagement.service';
module(SECRET_MANAGEMENT_SERVICE, [API_SERVICE])
  .factory('secretManagementService', (API: Api, $q: IQService) => new SecretManagementService(API, $q));
