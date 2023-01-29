import { SelectEventArgs, TabComponent, TabItemDirective, TabItemsDirective } from "@syncfusion/ej2-react-navigations";
import React from "react";
import { AWorkflow } from "../apis/Models";
import WorkflowManagerApi from "../apis/WorkflowManager";
import WorkflowExecutionView from "./WorkflowExecutionView";
import WorkflowParametersView from "./WorkflowParametersView";
import WorkflowsSearchView from "./WorkflowsSearchView";
import WorkflowView from "./WorkflowView";

export default class WorkflowsTabPanel extends React.Component {

    public selectedWorkflow!: AWorkflow;

    private tabHeaders: any = [
        { "text": "Search" },
        { "text": "View" },
        { "text": "Parameters" },
        { "text": "Schedule/Execute" }];

    private tab!: TabComponent | null;

    private static instance: WorkflowsTabPanel;

    public static getInstance() {
        return this.instance;
    }

    constructor(props: any) {
        super(props);
        WorkflowsTabPanel.instance = this;
    }

    onCreated() {
        // Enable the search tab only.
        if(this.tab) {
            this.tab.enableTab(0, true);
            this.tab.enableTab(1, false);
            this.tab.enableTab(2, false);
            this.tab.enableTab(3, false);
            this.tab.select(0);
        }
    }

    /**
     * The method is called by either parameters or execute view to navigate to the search view
     */
    navigateToSearchView() {
        if(this.tab) {
            this.tab.enableTab(0, true); 
            this.tab.enableTab(1, false);
            this.tab.enableTab(2, false);
            this.tab.enableTab(3, false);
            this.tab.select(0);
        }
    }

    /**
     * The method is called from the search view.
     * @param flow 
     */
    async navigateToWorkflowView(flow: AWorkflow | null = null) {
      if(flow) {
         this.selectedWorkflow = flow;
      }
      if(this.tab) {
          this.tab.enableTab(0, true); // Do we allow this?
          this.tab.enableTab(1, true);
          this.tab.enableTab(2, false);
          this.tab.enableTab(3, false);
          this.tab.select(1);
          if(document.getElementById("workflowViewHtmlId")) {
            let workflowViewHtml = document.getElementById("workflowViewHtmlId");
            if(workflowViewHtml) {
              let workflowMgr = WorkflowManagerApi.getInstance();
              let content = await workflowMgr.getWorkflowHtmlView(this.selectedWorkflow);
              if(!content) {
                content = "No task preview is available.";
              }
              workflowViewHtml.innerHTML = content;
            }
          }
      }
    } 

    /**
     * The method is called from the workflow view.
     */
    navigateToParametersView() {
        
        if(this.tab) {
            this.tab.enableTab(0, true); // Do we allow this?
            this.tab.enableTab(1, true);
            this.tab.enableTab(2, true);
            this.tab.enableTab(3, false);
            this.tab.select(2);
        }
    }

    navToParameterBack() {
      if(this.tab) {
        this.tab.enableTab(0, true); // Do we allow this?
        this.tab.enableTab(1, true);
        this.tab.enableTab(2, true);
        this.tab.enableTab(3, false);
        this.tab.select(2);
      }
    }

    /**
     * The method is called by the parameters or search view to navigate to the execution view
     */
    navigateToExecutionView() {
      if(this.tab) {
          this.tab.enableTab(0, true); 
          this.tab.enableTab(1, true);
          this.tab.enableTab(2, true);
          this.tab.enableTab(3, true);
          this.tab.select(3);
      }
    }
    
    private tabSelecting(e: SelectEventArgs): void {
        if (e.isSwiped) {
          e.cancel = true;
        }
    }


    render() {
        return (
          <div>
            <div className="col-lg-12 control-section e-tab-section">
              <div className="e-sample-resize-container">
                <TabComponent id="tab-wizard" ref={tab => (this.tab = tab)} heightAdjustMode="None" height={'auto'} selecting={this.tabSelecting.bind(this)}>
                  <TabItemsDirective>
                    <TabItemDirective header={this.tabHeaders[0]} content={WorkflowsSearchView}/>
                    <TabItemDirective header={this.tabHeaders[1]} content={WorkflowView} disabled={true} />
                    <TabItemDirective header={this.tabHeaders[2]} content={WorkflowParametersView} disabled={true}/>
                    <TabItemDirective header={this.tabHeaders[3]} content={WorkflowExecutionView} disabled={true}/>
                  </TabItemsDirective>
                </TabComponent>
              </div>
            </div>
          </div >
        );
    }
}
