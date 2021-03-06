import { HelpContentsRegistry } from '@spinnaker/core';

const helpContents: { [key: string]: string } = {
  'dcos.loadBalancer.group':
    '<p>(Optional) The DC/OS group under which the application should live.</p><p> It can be a hierarchical path, delimited by backslashes.<p/><p>This will often be referred to as <b>Region</b> in Spinnaker.</p>',
  'dcos.loadBalancer.cpus': '(Required) Amount of CPUs used for the load balancer (default: 2).',
  'dcos.loadBalancer.mem': '(Required) Amount of memory used for the load balancer (default: 1024).',
  'dcos.loadBalancer.instances': '(Required) Number of instances of the load balancer to be deployed (default: 1).',
  'dcos.loadBalancer.acceptedResourceRoles':
    '(Optional) Deploy the load balancer only on nodes with this role (default: slave_public).',
  'dcos.loadBalancer.bindHttpHttps':
    '<p>Reserve ports 80 and 443 for the load balancer.</p>Use this if you intend to use virtual hosts (default: true).',
  'dcos.loadBalancer.portRange.minPort':
    '(Required) The minimum port in the port range to be reserved. This value must be >= 10000 (default: 10000).',
  'dcos.loadBalancer.portRange.maxPort':
    '(Required) The maximum port in the port range to be reserved. This value must be <= 65535 (default: 10100).',
  'dcos.loadBalancer.portRange.protocol':
    '(Required) The protocol to be reserved for the given port range (default: TCP).',
  'dcos.loadBalancer.detail':
    '(Optional) A string of free-form alphanumeric characters; by convention, we recommend using "frontend".',
  'dcos.loadBalancer.stack':
    '(Optional) One of the core naming components of a cluster, used to create vertical stacks of dependent services for integration testing.',
  'dcos.serverGroup.region':
    '(Required) One of the core naming components of a cluster, used to create logical groupings with DCOS (using Marathon groups) of applications (default: "default").',
  'dcos.serverGroup.group':
    '(Optional) The DC/OS group under which the application should live.<p> It can be a hierarchical path, delimited by backslashes.<p/>',
  'dcos.serverGroup.stack':
    '(Optional) One of the core naming components of a cluster, used to create vertical stacks of dependent services for integration testing.',
  'dcos.serverGroup.freeFormDetails':
    '(Optional) A string of free-form alphanumeric characters and hyphens to describe any other variables.',
  'dcos.serverGroup.cpus': 'Amount of CPUs used for the service.',
  'dcos.serverGroup.gpus': 'Amount of GPUs used for the service.',
  'dcos.serverGroup.cmd': 'Command executed by the service.',
  'dcos.serverGroup.executor':
    "Executor must be the string '//cmd', a string containing only single slashes ('/'), or blank.",
  'dcos.serverGroup.uris': 'Comma-separated list of valid URIs.',
  'dcos.serverGroup.constraints':
    'Comma-separated list of valid constraints. Valid constraint format is "field:operator[:value]".',
  'dcos.serverGroup.acceptedResourceRoles':
    'Comma-separated list of resource roles. Marathon considers only resource offers with roles in this list for launching tasks of this app.',
  'dcos.serverGroup.healthCheck.gracePeriodSeconds': 'Grace period in seconds.',
  'dcos.serverGroup.healthCheck.intervalSeconds': 'Interval in seconds.',
  'dcos.serverGroup.healthCheck.timeoutSeconds': 'Timeout in seconds.',
  'dcos.serverGroup.docker.image': 'Configure your Docker container. Use DockerHub to find popular repositories.',
  'dcos.serverGroup.forceDeployment':
    'This can be used to forcefully stop an existing deployment currently running for this server group in DC/OS (as deployments within DC/OS will block anymore from starting for that app).',
  'dcos.serverGroup.vaultSecrets.vaultkeeperConfiguration':
    'Used by the Vaultkeeper agent for the application to manage dynamic secrets from Vault.',
  'dcos.serverGroup.vaultSecrets.applicationEntrypoint': 'Shell command used to launch the application.',
  'dcos.serverGroup.vaultSecrets.outputPath':
    "Where the fetched Vault secrets will reside on the application's filesystem.",
  'dcos.serverGroup.vaultSecrets.refreshInterval': 'Period to check if dynamic secret leases are still valid.',
  'dcos.serverGroup.vaultSecrets.leaseIncrement': 'Period by which to extend existing leases.',
  'dcos.serverGroup.vaultSecrets.renewalGrace': 'Time to expiry before Vaultkeeper renews the lease.',
  'dcos.serverGroup.vaultSecrets.vaultConfiguration':
    'Details about your Vault instance, mandatory if using Vault secrets.',
  'dcos.serverGroup.vaultSecrets.vaultAddress': 'Address of your Vault host.',
  'dcos.serverGroup.vaultSecrets.addVaultDockerHost': "Add the Vault address to task containers' /etc/hosts file.",
  'dcos.serverGroup.vaultSecrets.gatekeeperAddress':
    'Address of your Secure Introduction Agent (ie. vault-gatekeeper-mesos).',
  'dcos.serverGroup.vaultSecrets.addGatekeeperDockerHost':
    "Add the Gatekeeper address to task containers' /etc/hosts file.",
  'dcos.serverGroup.vaultSecrets.credentialPath': 'Where your task/application should look for its credentials.',
  'dcos.serverGroup.vaultSecrets.setSecretsOutput':
    'Select this if you want your task/application to use the Vaultkeeper output for credentials (recommended).',
  'dcos.serverGroup.vaultSecrets.backend': "Secret type from Vault's Secret Engines.",
  'dcos.serverGroup.vaultSecrets.policy': 'Access policy for the resource.',
  'dcos.serverGroup.vaultSecrets.setRole':
    'Required by the PostgreSQL secret engine to revoke dynamic credentials correctly - the role that owns the database objects.',
};

Object.keys(helpContents).forEach(key => HelpContentsRegistry.register(key, helpContents[key]));
