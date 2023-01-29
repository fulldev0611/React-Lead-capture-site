import axios from 'axios';

const execute = '/workflows/execute';

export class AWorkflowParameter {
    id!: string;
    name!: string;
    description!: string;
    usage!: string;
    displayed!: boolean;
    type!: string;
    format!: string;
    default!: string;
    required!: boolean;
    allowed_values!: string[];
    masked!: boolean;
    actual_values!: string[];
}

export class AWorkflowSchedule {
    id!: string;
    start!: boolean;
    end!: boolean;
    cron_expression!: string;
}

export class AWorkflow {
    id!: number;
    name!: string;
    name_with_namespace!: string;
    description!: string;
    path!: string;
    path_with_namespace!: string;
    default_branch!: string;
    topics!: string[];
    http_url_to_repo!: string;
    web_url!: string;
    star_count!: number;
    schedule!: AWorkflowSchedule
    parameters!: AWorkflowParameter[];
}

export class UsedWorkflow {
    id!: number;
	workflowId!: string;
	gitlabProjectId!: number;
	workspaceId!: string;
	status!: string;
	name!: string;
	userId!: string;
	createdAt!: Date;
}



export type ExecutePayload = {
    id: string;
}
  

export const executeTask = async (payload: ExecutePayload, mock = true) => {
    if (mock) return { status: 200, message: 'Success'};
    const response = await axios.post(execute, payload)
}