import axios from "axios";
import { baseWorkflowManagerUrl, workflowHtmlView, workflowSearch } from "./Endpoints";
import keycloak from "../Keycloak";
import { AWorkflow, UsedWorkflow } from "./Models";

export default class WorkflowManagerApi {

    private mockedWorkflows: AWorkflow[] = [
        {
            id: 20,
            path: 'pull-git-repository',
            path_with_namespace: 'pull-git-repository',
            description: 'This task will pull a git repository using a username and a personal access token.',
            web_url: 'https://gitlab.dev.workspacenow.cloud/platform-workflows/pull-git-repository',
            topics: ['type=task', 'target=workspace'],
            name: 'Pull Git Repository',
            default_branch: 'main',
            http_url_to_repo: 'https://gitlab.dev.workspacenow.cloud/platform-workflows/pull-git-repository.git',
            name_with_namespace: 'Pull Git Repository',
            star_count: 0,
            schedule: {
                id: '1',
                start: true,
                end: false,
                cron_expression: '',
            },
            parameters: [
                {
                    id: '1',
                    name: 'token',
                    description: 'Reserved parameter that indicates if the workflow needs to use a token',
                    displayed: false,
                    allowed_values: ['officekube', 'github'],
                    actual_values: ['officekube'],
                    type: 'string',
                    required: true,
                    usage: '',
                    format: '',
                    default: 'officekube',
                    masked: false
                },
                {
                    id: '2',
                    name: 'repo_url',
                    description: 'Git Repo Url',
                    displayed: true,
                    allowed_values: [],
                    actual_values: [],
                    type: 'string',
                    required: true,
                    usage: 'Please provide an https URL to your git repository.',
                    format: '',
                    default: 'https://github.com/myrepo.git',
                    masked: false
                },
                {
                    id: '3',
                    name: 'IPAddress',
                    description: 'IP Address',
                    displayed: true,
                    allowed_values: [],
                    actual_values: [],
                    type: 'string',
                    required: true,
                    usage: 'Please provide an IP Address.',
                    format: '[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9]',
                    default: '',
                    masked: false
                },
                {
                    id: '4',
                    name: 'SomeBool',
                    description: 'Some Boolean Parameter',
                    displayed: true,
                    allowed_values: [],
                    actual_values: [],
                    type: 'boolean',
                    required: true,
                    usage: 'Please (un)check the box.',
                    format: '',
                    default: '',
                    masked: false
                },
                {
                    id: '5',
                    name: 'SomeList',
                    description: 'Fruit List',
                    displayed: true,
                    allowed_values: ['Strawberry', 'Raspberry', 'Cherry', 'Apple', 'Blueberry'],
                    actual_values: [],
                    type: 'array',
                    required: true,
                    usage: 'Please select appropriate value.',
                    format: '',
                    default: 'Blueberry',
                    masked: false
                }
            ]
        }
    ];

    private static instance: WorkflowManagerApi;

    public static getInstance() {
        if(!WorkflowManagerApi.instance) {
            WorkflowManagerApi.instance = new WorkflowManagerApi();
        }
        return this.instance;
    }

    constructor() {
        WorkflowManagerApi.instance = this;
    }

    private getAuthTokenHeader() {
        return {
            Authorization: `Bearer ${keycloak.token}`,
        };
    };
  
    public async findWorkflowsByKeyword(searchTerm: string, mock = false): Promise<AWorkflow[]> {
        // Set the mock paramater for the method to true if need to test offline.
        if (mock) return this.mockedWorkflows;

        let httpHeaders = this.getAuthTokenHeader();
        const response = await axios.get(baseWorkflowManagerUrl + workflowSearch + '?search=' + searchTerm, {headers: httpHeaders});
       
        return response.data.projects;
    }

    public async getWorkflowHtmlView(w: AWorkflow, mock = false): Promise<string> {
        if (mock) return "<h3>" + Math.random() + "Populated from the Tab Panel.</h3>";

        let httpHeaders = this.getAuthTokenHeader();
        let uWorkflow = new UsedWorkflow();
        uWorkflow.gitlabProjectId = w.id;
        uWorkflow.name = w.name;
        // FIXME: need to populate the 2 fields below
        uWorkflow.workspaceId = "Pull from Wsp Engine Config";
        uWorkflow.userId = "Pull from Wsp Engine Config";
        const response = await axios.post(baseWorkflowManagerUrl + workflowHtmlView, uWorkflow, {headers: httpHeaders});
        return response.data;
    }
}