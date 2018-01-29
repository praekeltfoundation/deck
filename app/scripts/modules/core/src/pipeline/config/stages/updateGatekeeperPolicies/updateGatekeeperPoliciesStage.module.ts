import { module } from 'angular';

import { UPDATE_GATEKEEPER_POLICIES_STAGE } from './updateGatekeeperPoliciesStage';
import { IGOR_SERVICE } from 'core/ci/igor.service';
import { STAGE_CORE_MODULE } from '../core/stage.core.module';
import { TIME_FORMATTERS } from 'core/utils/timeFormatters';
import { UPDATE_GATEKEEPER_POLICIES_EXECUTION_DETAILS_CONTROLLER } from './updateGatekeeperPoliciesExecutionDetails.controller';

export const UPDATE_GATEKEEPER_POLICIES_STAGE_MODULE = 'spinnaker.core.pipeline.stage.updateGatekeeperPolicies';
module(UPDATE_GATEKEEPER_POLICIES_STAGE_MODULE, [
  UPDATE_GATEKEEPER_POLICIES_STAGE,
  require('../stage.module.js').name,
  STAGE_CORE_MODULE,
  TIME_FORMATTERS,
  IGOR_SERVICE,
  UPDATE_GATEKEEPER_POLICIES_EXECUTION_DETAILS_CONTROLLER,
]);
