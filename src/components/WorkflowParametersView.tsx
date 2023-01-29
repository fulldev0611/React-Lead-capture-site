import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import { TextBoxComponent, MaskedTextBoxComponent, NumericTextBoxComponent, MaskChangeEventArgs, ChangedEventArgs, ChangeEventArgs } from "@syncfusion/ej2-react-inputs";
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ListViewComponent, SelectEventArgs } from '@syncfusion/ej2-react-lists';
import React from "react";
import { AWorkflowParameter } from "../apis/Models";
import WorkflowsTabPanel from "./WorkflowsTabPanel";
import infoIcon from '../assets/images/info_square_icon.svg'

export default class WorkflowParametersView extends React.Component {
    private backBtnHandler(): void {
        WorkflowsTabPanel.getInstance().navigateToWorkflowView();
    }

    private forwardBtnHandler(): void {
        
        WorkflowsTabPanel.getInstance().navigateToExecutionView();
    }

    private RenderParameterInputField(props: any) {
        let result;
        let name = props.Parameter.name as string;
        switch(props.Parameter.type) {
            case "string":
                // If format is specified we use the masked text box with the format specified as per
                // https://ej2.syncfusion.com/react/documentation/maskedtextbox/mask-configuration/
                if (props.Parameter.format.length > 0) {
                    let MaskedTextBoxComponentChanged = (field: string) => async (event: MaskChangeEventArgs) => {
                        let param = WorkflowsTabPanel.getInstance().selectedWorkflow.parameters.find(param => param.name === field);
                        if(param && event.value) {
                            param.actual_values[0] = event.value;
                        }
                    }
                    result = <MaskedTextBoxComponent value={props.Parameter.default} name={name} mask={props.Parameter.format} change={MaskedTextBoxComponentChanged(name)} cssClass="e-outline" placeholder="Populate Parameter" floatLabelType='Auto' />
                } else {
                    let TextBoxComponentChanged = (field: string) => async (event: ChangedEventArgs) => {
                        let param = WorkflowsTabPanel.getInstance().selectedWorkflow.parameters.find(param => param.name === field);
                        if(param && event.value) {
                            param.actual_values[0] = event.value;
                        }
                    }
                    result = <TextBoxComponent value={props.Parameter.default} name={name} change={TextBoxComponentChanged(name)} cssClass="e-outline" placeholder="Populate Parameter" floatLabelType='Auto' />
                }
                break;
            case "number":
                if (props.Parameter.format.length > 0) {
                    let MaskedNumberBoxComponentChanged = (field: string) => async (event: MaskChangeEventArgs) => {
                        let param = WorkflowsTabPanel.getInstance().selectedWorkflow.parameters.find(param => param.name === field);
                        if(param && event.value) {
                            param.actual_values[0] = event.value;
                        }
                    }
                    result = <MaskedTextBoxComponent value={props.Parameter.default} name={name} change={MaskedNumberBoxComponentChanged(name)} mask={props.Parameter.format} cssClass="e-outline" placeholder="Populate Parameter" floatLabelType='Auto' />
                } else {
                    let NumberTextBoxComponentChanged = (field: string) => async (event: ChangeEventArgs) => {
                        let param = WorkflowsTabPanel.getInstance().selectedWorkflow.parameters.find(param => param.name === field);
                        if(param && event.value) {
                            param.actual_values[0] = event.value.toString();
                        }
                    }
                    result = <NumericTextBoxComponent value={props.Parameter.default} name={name} change={NumberTextBoxComponentChanged(name)} cssClass="e-outline" placeholder="Populate Parameter" floatLabelType='Auto' />
                }
                break;
            case "boolean":
                let CheckBoxComponentChanged = (field: string) => async (event: any) => {
                    console.log(event);
                    let param = WorkflowsTabPanel.getInstance().selectedWorkflow.parameters.find(param => param.name === field);
                    if(param) {
                        param.actual_values[0] = event.checked as string;
                    }
                }
                result = <CheckBoxComponent label={props.Parameter.description} name={name} change={CheckBoxComponentChanged(name)}/>
                break;
            case "array":
                let allowedValues: string[] = props.Parameter.allowed_values;
                // FIXME: The option  isChecked used below to pre-select a value (from default) does not work.
                // Try selectItem method later https://ej2.syncfusion.com/react/documentation/api/list-view/#selectitem
                let listSource: { [key: string]: string }[] = allowedValues.map((row, index) => 
                    { 
                        // Set selected value, if there is one.
                        if(props.Parameter.default.length > 0) {
                            if(props.Parameter.default === row) {
                                return {id: index.toString(), text: row, isChecked: "True"};
                            } else {
                                return {id: index.toString(), text: row, isChecked: "False"};
                            }
                        } else {
                            return {id: index.toString(), text: row, isChecked: "False"};
                        }
                    });
                let ListeViewComponentValueSelected = (field: string) => async (event: SelectEventArgs) => {
                        let param = WorkflowsTabPanel.getInstance().selectedWorkflow.parameters.find(param => param.name === field);
                        if(param) {
                            param.actual_values[0] = event.text;
                        }
                    }
                result = <ListViewComponent name={name} dataSource={listSource} select={ListeViewComponentValueSelected(name)} className="workflowArrayParameter"/>
                break;
            default:
                // Will assume that the field should NOT be displayed
        }
        return <div className="workflowParamaterField">{result}</div>
    }

    render() {
        let { parameters } = WorkflowsTabPanel.getInstance().selectedWorkflow;
        if(!parameters) {
            return (
                <div>
                    <div className="nav-button">
                        <ButtonComponent cssClass='e-info' onClick={this.backBtnHandler.bind(this)}> 
                          &lt;&lt;
                        </ButtonComponent>
                        <ButtonComponent cssClass='e-info' onClick={this.forwardBtnHandler.bind(this)}> 
                          &gt;&gt;
                        </ButtonComponent>
                    </div>
                    <div className = "noParameterLabel" >
                        <label>The task does not have any parameters.</label>
                    </div>
                </div>
            );
        }
        else {
          return (
            <div>
                <div className="nav-button">
                    <ButtonComponent cssClass='e-info' onClick={this.backBtnHandler.bind(this)}> 
                        &lt;&lt;
                    </ButtonComponent>
                    <ButtonComponent cssClass='e-info' onClick={this.forwardBtnHandler.bind(this)}> 
                        &gt;&gt;
                    </ButtonComponent>
                </div>
              
                <div className='workflowSeachView'>
                    <label>Task Parameters:</label>
                </div>
                <span className="workflowParamaterListSeparator"></span>
                <div className="workflowParamaterList">
                    {parameters.map((param: AWorkflowParameter, i: React.Key | null | undefined) => 
                        <>
                            <div className="workflowParamaterRow" hidden={!param.displayed}>
                            <TooltipComponent id="box" content={param.usage} className="workflowParamaterNameRow">
                                <label key={i}>Name: {param.description}</label>
                                <img src={infoIcon}/>
                            </TooltipComponent>
                            <this.RenderParameterInputField key={i} Parameter={param} hidden={!param.displayed}/>
                            </div>
                        </>
                    )}
                </div>
            </div>
          );
        }
      };
}