export const groupchat_message = async (messageData: any) => {
    const url = process.env.PROXY_URL_GROUP + "/groupchat/message";
    try {
      let msg: any = create_group_chat_data(messageData);
      if (!msg.agents) {
        console.error("Data integrity check failed: Missing `agents` key");
        return; // Stop the function if no agents are found
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      });
  
  
      const data = await response.json();
      // let htmlContent =
      //   `<div style="font-family: Arial, sans-serif; padding: 2px;">`;
      // htmlContent += `
      //     <ul>`;
      // const groupchat = data.chat_history;
      // for (let i = 0; i < groupchat.length; i++) {
      //   htmlContent += `
      //       <div class="bg-white shadow-lg rounded-lg md:p-6 p-2 w-full">
      //       <li>${groupchat[i].name}: ${groupchat[i].content}
      //       </li></div>`;
      // }
      // htmlContent += `</ul></div>`;
  
      return JSON.stringify(data.chat_history);
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return null;
    }
  };
  
  export const scrum_team_message = async (messageData: any) => {
    const url = process.env.PROXY_URL_GROUP + "/scrum/message";
    try {
      let msg: any = create_scrum_team_data(messageData);
      if (!msg.agents) {
        console.error("Data integrity check failed: Missing `agents` key");
        return; // Stop the function if no agents are found
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      });
  
  
      const data = await response.json();
      const groupchat = data.chat_history;
  
      let htmlContent =
        `<div style="font-family: Arial, sans-serif; padding: 2px;">`;
      htmlContent += `<h4>${data.message}</h4>`;
      htmlContent += `
          <ul>`;
      for (let i = 0; i < groupchat.length; i++) {
        htmlContent += `
            <div class="bg-white shadow-lg rounded-lg md:p-6 p-2 w-full">
            <li>${groupchat[i].name}: ${groupchat[i].content}
            </li></div>`;
      }
      htmlContent += `</ul></div>`;
  
      return "!!!IMPORTANT!!! MUST RETRUN FULL CONTENT:"+JSON.stringify(data.chat_history);
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return null;
    }
  };
  
  
  export function create_group_chat_data(data: any): any {
    data.content = data.content || "Hello, world!";
    data.agents = data.agents.map((agent: any) => ({
      ...agent, // spread the existing agent properties
      config: {
        // overwrite or set the `config` property
        llm_config: {
          seed: 42,
          config_list: [
            {
              model: "gpt-4o",
            },
          ],
          temperature: 0.5,
        },
        code_execution_config: {
          work_dir: "azure_devops",
          use_docker: false,
          last_n_messages: 3,
        },
        functions: ["assign_tasks", "verify_task_completion"],
      },
    }));
    return data;
  };
  
  export function create_scrum_team_data(scrumContent: any): any {
    // Default content if none provided
    let scrumTeamData: any = {
      model: "gpt-3.5-turbo",
      content: scrumContent,
      agents: [] as any[],
    };
    // Map of configurations for different agent types
    const agentConfigMap: any = {
      sprint_planning_agent: {
        seed: 60,
        config_list: [{ model: "gpt-3.5-turbo" }],
        temperature: 0.1,
        functions: [
          "organize_sprint_planning",
          "create_user_stories",
          "refine_tasks",
        ],
        work_dir: "azure_devops",
        use_docker: false,
        last_n_messages: 3,
        message:
          "Assist with sprint planning activities, including the creation and refinement of user stories and tasks in Azure DevOps.",
      },
      backlog_management_agent: {
        seed: 60,
        config_list: [{ model: "gpt-3.5-turbo" }],
        temperature: 0.1,
        functions: ["prioritize_backlog", "update_user_stories"],
        work_dir: "azure_devops",
        use_docker: false,
        last_n_messages: 3,
        message:
          "Focus on backlog refinement and prioritization in Azure DevOps.",
      },
      sprint_review_agent: {
        seed: 60,
        config_list: [{ model: "gpt-3.5-turbo" }],
        temperature: 0.1,
        functions: ["prepare_sprint_review", "summarize_completed work"],
        work_dir: "azure_devops",
        use_docker: false,
        last_n_messages: 3,
        message:
          "Prepare and conduct sprint review meetings, showcasing new features to stakeholders.",
      },
      sprint_retrospective_agent: {
        seed: 60,
        config_list: [{ model: "gpt-3.5-turbo" }],
        temperature: 0.1,
        functions: ["facilitate_retrospective", "identify_improvements"],
        work_dir: "azure_devops",
        use_docker: false,
        last_n_messages: 3,
        message:
          "Facilitate the sprint retrospective, gathering feedback and identifying action items for improvement.",
      },
      progress_monitoring_agent: {
        seed: 60,
        config_list: [{ model: "gpt-3.5-turbo" }],
        temperature: 0.1,
        functions: ["monitor_sprint_progress", "generate_reports"],
        work_dir: "azure_devops",
        use_docker: false,
        last_n_messages: 3,
        message:
          "Monitor and report the progress of sprints using Azure DevOps boards and dashboards.",
      },
    };
  
    scrumTeamData.agents = Object.keys(agentConfigMap).map((agentName) => {
      const config = agentConfigMap[agentName];
      return {
        agent_name: agentName,
        type: "ScrumMasterAssistant", // Assuming a default type; adjust as necessary
        config: {
          llm_config: {
            seed: config.seed,
            config_list:  config.config_list,
            temperature: config.temperature,
          },
          code_execution_config: {
            work_dir: config.work_dir,
            use_docker: config.use_docker,
            last_n_messages: config.last_n_messages,
          },
          functions: ["read_doc"],
        },
        message: config.message
      };
    });
  
    console.log("Processed team data:", JSON.stringify(scrumTeamData));
    return scrumTeamData;
  };