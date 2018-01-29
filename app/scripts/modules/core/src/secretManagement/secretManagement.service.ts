
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

  public addGatekeeperPolicies(newPolicies: string = null): IPromise<string> {
    const gkPolicies: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').get();
    if (!gkPolicies) {
      return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
    }
    const current = JSON.parse(gkPolicies.toString());
    const npolicies = JSON.parse(newPolicies);

    Object.keys(npolicies).forEach((key) => {
      // If key already exists, we overwrite it
      current[key] = npolicies[key];
    })
    return this.updateGatekeeperPolicies(JSON.stringify(current))
  }

  public removeGatekeeperPolicies(removedPolicies: string = null): IPromise<string> {
    const gkPolicies: IPromise<string> = this.API.one('secrets').one('gatekeeper').one('policies').get();
    if (!gkPolicies) {
      return this.$q.reject('An error occurred when attempting to retrieve Gatekeeper policices from Vault.');
    }
    const current = JSON.parse(gkPolicies.toString());
    const rpolicies = JSON.parse(removedPolicies);

    Object.keys(rpolicies).forEach((key) => {
      // If key exists, we remove it
      delete current[key];
    })
    return this.updateGatekeeperPolicies(JSON.stringify(current))
  }

  public getGatekeeperPolicyUpdateUrl(): string {
    return this.API.baseUrl + '/secrets/gatekeeper';
  }

  private updateGatekeeperPolicies(newPolicies: string = null): IPromise<string> {
    const nPolicies = JSON.parse(newPolicies);
    const response: IPromise<string> = this.API.one('secrets').one('gatekeeper').post(nPolicies);
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
