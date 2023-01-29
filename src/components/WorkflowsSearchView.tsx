import { InputEventArgs, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ListViewComponent, SelectEventArgs } from '@syncfusion/ej2-react-lists';
import React from 'react';
import { AWorkflow } from '../apis/Models';
import WorkflowsTabPanel from './WorkflowsTabPanel';
import WorkflowManagerApi from '../apis/WorkflowManager';

export default class WorkflowsSearchView extends React.Component {
  
  private foundWorkflowsSource: { [key: string]: string }[] = [];
  private foundWorkflows!: AWorkflow[];
  private selectedWorkflow!: AWorkflow;
  private listViewRef: ListViewComponent | null = new ListViewComponent(null);

  private prevSearchTerm: string = "";
 

  /**
   * Event handler is triggered every time a user changes a value of the search field.
   * @param field 
   * @returns 
   */
  private TextBoxUpdated = (field: string) => async (event: InputEventArgs) => {
    switch(field) {
      case 'searchTerm':
        if(typeof event.value != 'undefined' && event.value && event.value.length > 2 && this.prevSearchTerm !== event.value) {
          this.prevSearchTerm = event.value;
          this.findWorkflowsAndUpdateWorkflowListView(event.value);
        }
    }
  };

  private async findWorkflowsAndUpdateWorkflowListView(searchTerm: string) {
    let workflowMgr = WorkflowManagerApi.getInstance();
    this.foundWorkflows = await workflowMgr.findWorkflowsByKeyword(searchTerm);
    let noTaskLabel = document.getElementById('noTaskFoundLabelId');
    if(noTaskLabel) {
      if(!this.foundWorkflows || this.foundWorkflows.length === 0) {
        noTaskLabel.hidden = false;
      } else {
        noTaskLabel.hidden = true;
      }
    }
    this.foundWorkflowsSource = this.foundWorkflows.map((row) => { return {id: row.id.toString(), text: row.name}});
    let lv: ListViewComponent = this.listViewRef as ListViewComponent;
    lv.dataSource = this.foundWorkflowsSource;
  }

  private showAllTasksBtnHandler(): void {
    this.findWorkflowsAndUpdateWorkflowListView('*');
  }

  /**
   * Event handler is triggered when a user selects any of the found tasks.
   * @param field 
   * @returns 
   */
  private TaskSelected = (field: string) => (event: SelectEventArgs) => {
    switch(field) {
      case 'FoundTasks':
        // Find a matching flow and pass it to the parameters view
        this.selectedWorkflow = this.foundWorkflows[event.index];
        WorkflowsTabPanel.getInstance().navigateToWorkflowView(this.selectedWorkflow);
    }
  };

  /**
   * The method is called when a user clicks on any item in the list of found workflows.
   * The handler is necessary to properly handle a case when a user navigates from the parameters view to the search view and clicks
   * on the previously selected workflow. In this case the selectedTask handler is NOT triggered.
   */
  private taskClickedHandler(): void {
    if(this.selectedWorkflow) {
      WorkflowsTabPanel.getInstance().navigateToWorkflowView(this.selectedWorkflow);
    }
  }
  
  private onInputFocus(args: React.FocusEvent) {
    ((args.target as HTMLElement).parentElement as HTMLElement).classList.add('e-input-focus');
  }
     
  private onInputBlur(args: React.FocusEvent) {
    ((args.target as HTMLElement).parentElement as HTMLElement).classList.remove('e-input-focus');
  }
     
    
  
  render() {
    return (
        <div className = "searchBody">
          <label className='searchLabel'>Tasks:</label>
          <div className='workflowSeachView'>
            <TextBoxComponent name='searchTerm' input={this.TextBoxUpdated('searchTerm')} cssClass="e-outline workflowSearchField" placeholder="Enter Task Name (at least 3 characters)" floatLabelType='Auto' onFocus = {this.onInputFocus} onBlur = {this.onInputBlur}/>
            <div></div>
            <ButtonComponent cssClass='e-info' onClick={this.showAllTasksBtnHandler.bind(this)}>Show All Tasks</ButtonComponent>
          </div>
          <ListViewComponent onClick={this.taskClickedHandler.bind(this)} select={this.TaskSelected('FoundTasks')} id="list" dataSource={this.foundWorkflowsSource} ref={scope => {this.listViewRef = scope}}/>
          <label  id='noTaskFoundLabelId' hidden={true} className = 'noTaskLabel' >No task has been found. Please try another search term or click Show All Tasks.</label>
        </div>
    );
  };
}
