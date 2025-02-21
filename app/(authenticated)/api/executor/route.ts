import { get_agents_workflow } from "./tools/actuality";
import { executor, executor_file } from "./tools/code_exec";
import { make_chart } from "./tools/charts";
import { groupchat_message, scrum_team_message } from "./tools/group_chat";
import { list_repo_items, get_issues, get_issue, comment_on_issue, create_pull_request, create_repo_file, read_repo_file, update_repo_file, delete_repo_file } from "./tools/github";
import { get_memory, get_memories, add_memory, delete_memory, update_memory, get_vectors } from "./tools/mongodb_memory";
import { get_azure_retail_prices } from "./tools/azure_retail_prices";
import { get_azure_rag_calculate_costs, get_azure_rag_costs } from "./tools/azure_rag_calculator";
import { architect_waf_questionnaire } from "./tools/architect";

const functionMap: any = {
  executor,
  executor_file,
  make_chart,
  groupchat_message,
  scrum_team_message,
  list_repo_items,
  get_issues,
  get_issue,
  comment_on_issue,
  create_pull_request,
  create_repo_file,
  read_repo_file,
  update_repo_file,
  delete_repo_file,
  get_memory,
  get_memories,
  add_memory,
  delete_memory,
  update_memory,
  get_vectors,
  get_agents_workflow,
  get_azure_retail_prices,
  get_azure_rag_costs,
  get_azure_rag_calculate_costs,
  architect_waf_questionnaire
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const functionName = url.searchParams.get('function');
    
    if (!functionName || !(functionName in functionMap)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing function name' }), { status: 400 });
    }

    const body = await req.json();
    const result = await functionMap[functionName](body);
    return new Response(JSON.stringify(result));
  } catch (e) {
    console.error("🔴 Error", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}