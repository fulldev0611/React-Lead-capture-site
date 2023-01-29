import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import WorkflowsTabPanel from "./WorkflowsTabPanel";


export default class WorkflowView extends React.Component {

    private backBtnHandler(): void {
        WorkflowsTabPanel.getInstance().navigateToSearchView();
    }

    private forwardBtnHandler(): void {
        WorkflowsTabPanel.getInstance().navigateToParametersView();
    }

    render() {
        return(
            <div>
                <div className="nav-button">
                    <ButtonComponent cssClass='e-info' onClick={this.backBtnHandler.bind(this)}  > 
                    &lt;&lt;
                    </ButtonComponent>
                    <ButtonComponent cssClass='e-info' onClick={this.forwardBtnHandler.bind(this)}> 
                    &gt;&gt;
                    </ButtonComponent>
                </div>
                
                <div className='workflowView' >
                    <label className="workflowViewLabel" >The task allows you to:</label>
                    <div className='workflowViewHtml' id="workflowViewHtmlId" >
                    </div>
                </div>
            </div>
        );
    }
}