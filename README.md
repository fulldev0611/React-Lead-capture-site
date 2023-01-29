# Introduction

This project implements a workspace user interface, was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and uses [Syncfusion React UI components](https://ej2.syncfusion.com/react/documentation/introduction/) Toolbar, Dialog, and Menu.

# Design
The component is designed as per the Workspace Web-Interface [document](https://gitlab.dev.workspacenow.cloud/platform/dwc-knowledge-base/-/blob/master/technology/wsp_ui.md).

# Build
By default, the react app build assumes that the app is server at the [root](https://create-react-app.dev/docs/deployment#building-for-relative-paths). 
As the ui has to be server at /wui, the property homepage ([package.json](https://gitlab.dev.workspacenow.cloud/platform/wsp-ui/-/blob/main/package.json)) was set to "/wui".

The build command "npm run build" builds a production version using a so-called chunking mechanism where .js/.css files that the build produces include a hash (random number). The issue with that is it will require changing references to these files in the nginx configuration (is a part of the [base workspace docker image](https://gitlab.dev.workspacenow.cloud/platform/workspaces/-/blob/wsp-base/wsp-base/nginx/main.conf)) every time the interface component gets rebuilt.

To overcome this issue and as per this [link](https://stackoverflow.com/questions/55909340/can-i-turn-off-create-react-app-chunking-mechanism), a react dev dependency react-app-rewired was added to the project that injects a JS script that overrides the names of the .js/.css created by the build. This is accomplished as follows:
* package.json was modified to replace the buidl command with this `"build": "react-app-rewired build"`
* A script fil [config-overrides.js](https://gitlab.dev.workspacenow.cloud/platform/wsp-ui/-/blob/main/config-overrides.js) was added to the project. The script removes hash from each js/css file name.

# Deployment
The project has a pipeline that executes the command `npm run build` and publishes its output as an archive artifact. The artifact is then consumed by the pipeline of the base workspace docker image. For more details, refer to [here](https://gitlab.dev.workspacenow.cloud/platform/dwc-knowledge-base/-/blob/master/technology/wsp_ui.md), section Deployment.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

