
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
    gkPolicies.then((data: string) => {
      const current = JSON.parse(data)['data'];
      const npolicies = newPolicies;
      merged = angular.merge(current, npolicies)
    }, () => {
      return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
    });
    return this.updateGatekeeperPolicies(merged);
  }

  public removeGatekeeperPolicies(removedPolicies: any): IPromise<string> {
    const gkPolicies: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').get({});
    let current = JSON.parse('{}');
    gkPolicies.then((data: string) => {
      current = JSON.parse(data)['data'];
      const rpolicies = removedPolicies;
      Object.keys(rpolicies).forEach((key: string) => {
      // If key exists, we remove it
      delete current[key];
      });
    }, () => {
      return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
    });
    return this.updateGatekeeperPolicies(current);
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
