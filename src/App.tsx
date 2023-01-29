import { enableRipple } from '@syncfusion/ej2-base';
import { ItemDirective, ItemsDirective, ToolbarComponent, MenuComponent, MenuAnimationSettingsModel, FieldSettingsModel} from '@syncfusion/ej2-react-navigations';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactPlayer from 'react-player/lazy';
import keycloak from './Keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { StartButton } from './components/StartButton';
import { registerLicense } from '@syncfusion/ej2-base';
import WorkflowsTabPanel from './components/WorkflowsTabPanel';


// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt2VVhiQlFadVlJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkNgWX5Zc31VT2JbUkE=');

enableRipple(true);

const keycloakProviderInitConfig = {
  //onLoad: 'check-sso',
  onLoad: 'login-required',
}


type State = {
  showWorkflowSearchDlg: boolean;
  showPreview: boolean;
  previewId: null | number;
}

export default class ReactApp extends React.Component {

  menuItems: any;
  toolbarObj: ToolbarComponent | null;
  menuAnimationSettings: MenuAnimationSettingsModel;
  menuFieldSettings: FieldSettingsModel;

  // References to First Time Use Dlg
  firstTimeDlgObj: React.RefObject<DialogComponent> | null;
  firstTimeDlgButtons: ButtonPropsModel[];
  firstTimeDlgYTUrl: string;
  firstTimeDlgPlayerWidth: string | number = 420;
  firstTimeDlgPlayerHeight: string | number = 340;

  // References to the Workflow Search Dialog
  workflowSearchDlgObj: React.RefObject<DialogComponent> | null;
  state: State;
  setWorkflowSearchDlgClose: (val: boolean) => void;
  setPreview: (id: string) => void;


  onKeycloakEvent = (event: any, error: any) => {
    //console.log('onKeycloakEvent', event, error)
  }

  onKeycloakTokens = (tokens: any) => {
    //console.log('onKeycloakTokens', tokens)
  }

  constructor(props: any) {
    super(props);
    this.state = {
      showWorkflowSearchDlg: false,
      showPreview: false,
      previewId: null,
    }
    this.setWorkflowSearchDlgClose = (val) => {
      this.setState({ showWorkflowSearchDlg: false });
    }

    this.setPreview = (id: string) => {
      console.log('In here preview...');
      this.setState({
        showPreview: !this.state.showPreview,
        previewId: parseInt(id),
      })
    }
     // Menu items definition
     this.menuItems = [
      {
          header: 'Tasks',
          subItems: [
              { text: 'Search', itemId: 'SEARCH_ID' },
              { text: 'Execute', itemId: 'EXECUTE_ID' },
              { text: 'Schedule', itemId: 'SCHEDULE_TASK' }
          ]
      },
      {
          header: 'Navigate to...',
          subItems: [
              { text: 'Portal', itemId: 'PORTAL_ID' },
              { text: 'Swagger API Editor', itemId: 'SWAGGER_ID' }
          ]
      },
      {
          header: 'Help',
          subItems: [
              { text: 'First Time', itemId: 'HELP_FIRST_TIME_ID' },
              { text: 'How to...', itemId: 'HOW_TO_ID' }
          ]
      },
      {
        header: 'Profile',
        subItems:[
          {text: 'Profile', itemId: 'PROFILE'},
          {text: 'Logout', itemId: 'LOGOUT_KEYCLOAK'}
        ]
      }
    ];
    this.toolbarObj = new ToolbarComponent(props);
    this.menuAnimationSettings = {effect: 'None'};
    this.menuFieldSettings = {
      children: ['subItems', 'options'],
      text: ['header', 'text', 'value', 'itemId']
    };
    this.onCreated = this.onCreated.bind(this);
    this.menuSelected = this.menuSelected.bind(this);
    this.menuTemplate = this.menuTemplate.bind(this);

    // Initialize the first time use dialog
    this.firstTimeDlgObj = React.createRef();

    this.firstTimeDlgButtons = [{
      buttonModel: {
          content: 'Close',
          cssClass: 'e-flat',
          isPrimary: true,
      },
      'click': () => {
        if(this.firstTimeDlgObj?.current != null)
        {
          this.firstTimeDlgObj.current.visible = false;
        }
      }
    }];
    // FIXME: Call wsp engine API to pull values for some/all parameters below?
    this.firstTimeDlgYTUrl = 'https://www.youtube.com/watch?v=32eywT-bQhQ';
    this.firstTimedialogResized = this.firstTimedialogResized.bind(this);

    // Initialize the Workflow Search Dialog
    this.workflowSearchDlgObj = React.createRef();
  }

  onCreated() {
    if(this.toolbarObj != null)
    {
      this.toolbarObj.refreshOverflow();
      // Set the firstTimeDlgObj
      // FIXME: need to make an API call into the wsp engine to determine if the dialog should actually open.
      if(this.firstTimeDlgObj?.current != null)
      {
        this.firstTimeDlgObj.current.height = 500;
        this.firstTimeDlgObj.current.width = 450;
        this.firstTimeDlgPlayerHeight = this.firstTimeDlgObj.current.height - 170;
        this.firstTimeDlgPlayerWidth = this.firstTimeDlgObj.current.width - 40;
      }

      // Set the workflowSearchDlgObj
      if(this.workflowSearchDlgObj?.current != null) 
      {
        this.workflowSearchDlgObj.current.height = 400;
        this.workflowSearchDlgObj.current.width = 500;
      }
    }
  }

  menuSelected(args: any) {
    switch(args.item.itemId)
    {
      case "HELP_FIRST_TIME_ID":
        if(this.firstTimeDlgObj?.current != null) {
          this.firstTimeDlgObj.current.show();
        }
        break;
      case "PORTAL_ID":
        window.location.href = "https://portal.dev.workspacenow.cloud";
        break;
      case "SWAGGER_ID":
        window.open("/api-edit/");
        break;
      case "HOW_TO_ID":
        window.open("https://officekube.io/documentation/index.html");
        break;
      case "LOGIN_KEYCLOAK":
        window.open(keycloak.login());
        break;
      case "LOGOUT_KEYCLOAK":
        window.open(keycloak.logout());
        break;
      case "SEARCH_ID":
        this.setState({ showWorkflowSearchDlg: !this.state.showWorkflowSearchDlg })
        break;
      case "PROFILE":
        window.open("https://portal.dev.workspacenow.cloud/settings/profile");
        break;
      default:
        break;
    }
  }
  
  firstTimedialogClose()
  {
    if(this.firstTimeDlgObj?.current != null)
    {
      this.firstTimeDlgObj.current.visible = false;
    }
  }

  firstTimedialogResized(args: any)
  {
    var ftudHtmlEl = document.getElementById("firstTimeUseDlg");
    var ftudYtPlayerHtmlEl = document.getElementById("firstTimeDlgYTPlayer");
    if(ftudHtmlEl && ftudYtPlayerHtmlEl)
    {
      ftudYtPlayerHtmlEl.setAttribute("style", "height: " + (ftudHtmlEl.offsetHeight - 170) + "px; width: " + (ftudHtmlEl.offsetWidth - 40) + "px;");
    }
  }

  menuTemplate() {
    return (<MenuComponent id="menu" items={this.menuItems} fields={this.menuFieldSettings} animationSettings={this.menuAnimationSettings} select={this.menuSelected}/>);
  }

  public render() {

    const firstTimeDlgPosition = { X:"center", Y:"center" };
    const workflowSearchDlgPosition = { X:"right", Y:"top" };
    return (
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={keycloakProviderInitConfig}
        onEvent={this.onKeycloakEvent}
        onTokens={this.onKeycloakTokens}
      >
      <><ToolbarComponent id="toolbar" created={this.onCreated} ref={(scope) => { this.toolbarObj = scope; } }>
        <ItemsDirective>
          <ItemDirective template={ StartButton } cssClass='startButton'/>
          <ItemDirective template={this.menuTemplate} />
          <ItemDirective prefixIcon='em-icons e-shopping-cart' align='Right' />
        </ItemsDirective>
      </ToolbarComponent>
      <div className="App" id='dialog-target'>
        <DialogComponent visible={false} position={firstTimeDlgPosition} id='firstTimeUseDlg'
                        ref={this.firstTimeDlgObj} resizing = {this.firstTimedialogResized}
                        close={this.firstTimedialogClose} header='Welcome to Your Workspace!' enableResize={true} resizeHandles={['All']} allowDragging={true} 
                        showCloseIcon={true} buttons={this.firstTimeDlgButtons}>
          Press Play below to play back our tutorial.
          <ReactPlayer id='firstTimeDlgYTPlayer' url={this.firstTimeDlgYTUrl} width={this.firstTimeDlgPlayerWidth} height={this.firstTimeDlgPlayerHeight} controls={true}  />
        </DialogComponent>
      </div></>

      <DialogComponent visible={this.state.showWorkflowSearchDlg} id='workflowSearchDlg'
                       ref={this.workflowSearchDlgObj} position = {workflowSearchDlgPosition}
                       close={this.setWorkflowSearchDlgClose} header='Task Management' 
                       enableResize={true} resizeHandles={['All']} allowDragging={true} 
                       showCloseIcon={true} content={WorkflowsTabPanel} >
      </DialogComponent>

      </ReactKeycloakProvider>

      );
  }
    
}
ReactDOM.render(<ReactApp />, document.getElementById("toolbar"));

/**
 * <DialogComponent visible={this.state.showWorkflowSearchDlg} id='workflowSearchDlg'
                       ref={this.workflowSearchDlgObj} position = {workflowSearchDlgPosition}
                       close={this.setWorkflowSearchDlgClose} header='Workflow Search' 
                       enableResize={true} resizeHandles={['All']} allowDragging={true} 
                       showCloseIcon={true} content={WorkflowsSearchView} >
      </DialogComponent>
 */