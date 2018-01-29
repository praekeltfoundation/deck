import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { IExecutionStageSummary, IExecution } from 'core/domain';
import { Application } from 'core/application/application.model';
import { HoverablePopover } from 'core/presentation/HoverablePopover';
import { ExecutionBarLabel } from 'core/pipeline/config/stages/core/ExecutionBarLabel';

export interface IUpdateGatekeeperPoliciesExecutionLabelProps {
  stage: IExecutionStageSummary;
  execution: IExecution;
  application: Application;
  executionMarker: boolean;
}

export interface IUpdateGatekeeperPoliciesExecutionLabelState {
  target?: any;
}

export class UpdateGatekeeperPoliciesExecutionLabel extends React.Component<IUpdateGatekeeperPoliciesExecutionLabelProps, IUpdateGatekeeperPoliciesExecutionLabelState> {

  constructor(props: IUpdateGatekeeperPoliciesExecutionLabelProps) {
    super(props);
    this.state = {};
  }

  public render() {
    if (!this.props.executionMarker) {
      return (<ExecutionBarLabel {...this.props}/>);
    }
    const stage = this.props.stage;
    if (stage.isRunning) {
      const template = (
        <div>
          <div><b>{stage.name}</b></div>
        </div>
      );
      return (
        <HoverablePopover template={template}>
          {this.props.children}
        </HoverablePopover>
      );
    }
    const tooltip = <Tooltip id={stage.id}>{stage.name}</Tooltip>;
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span>{this.props.children}</span>
      </OverlayTrigger>
    )
  }
}
