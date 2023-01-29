import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import WorkflowsTabPanel from "./WorkflowsTabPanel";

export default class WorkflowExecutionView extends React.Component {

    private execAtStart: React.RefObject<CheckBoxComponent> | null;
    private execAtShutdown: React.RefObject<CheckBoxComponent> | null;

    private backBtnHandler(): void {
        WorkflowsTabPanel.getInstance().navigateToParametersView();
    }

    private executeBtnHandler(): void {
        // FIXME
        console.log(WorkflowsTabPanel.getInstance().selectedWorkflow);
    }

    private scheduleBtnHandler(): void {
        // FIXME
        let workflow = WorkflowsTabPanel.getInstance().selectedWorkflow;
        if(this.execAtStart && this.execAtStart.current) {
            workflow.schedule.start = this.execAtStart.current.checked;
        }

        if(this.execAtShutdown && this.execAtShutdown.current) {
            workflow.schedule.end = this.execAtShutdown.current.checked;
        }
        console.log(workflow);

    }

    constructor(props: any) {
        super(props);
        this.execAtStart = React.createRef();
        this.execAtShutdown = React.createRef();
    }
    
    render() {
        return(
            <div>
                <div className="nav-button">
                    <ButtonComponent cssClass='e-info' onClick={this.backBtnHandler.bind(this)}> 
                    &lt;&lt;
                    </ButtonComponent>
                </div>

                <div className='workflowExecutionView'>
                    <label>Execute the task immediately and/or schedule its execution.</label>
                </div>
                <div className='workflowExecuteViewSection'>
                    <ButtonComponent cssClass='e-info' onClick={this.executeBtnHandler.bind(this)}>Execute</ButtonComponent>
                </div>
                <div className='workflowScheduleViewSection'>
                    <CheckBoxComponent label="Execute the task when the Workspace starts." ref={this.execAtStart}/>
                    <CheckBoxComponent label="Execute the task when the Workspace shuts down." ref={this.execAtShutdown}/>
                    <div className="scheduleButton">
                        <ButtonComponent cssClass='e-info' onClick={this.scheduleBtnHandler.bind(this)}>Schedule</ButtonComponent>
                    </div>
                </div>
            </div>
        );
    }
}