export const get_agents_workflow = async (format: any="mermaid") => {

  return "```mermaid\n" + `
graph TD
%% Main Agent

subgraph Summary
    style Summary fill:#E6E6E7,stroke:#dbdbdb,stroke-width:2px;   
    Assistant[Assistant] -->  LFM[LFM]
    LFM --> Toolkit[Toolkit]
    Toolkit <--> Agent[Agent]
    Agent --> LFM
    Toolkit[Toolkit] --> System[System]  
end

User["User Question"] --> Connectorzzz
ConnectorzzzOmni -- Access --> ConnectorzzzAI
ConnectorzzzOmni -- Access --> PersonaAI

PersonaAI -- use --> LLM1[LLM]

LLM1 -- Call/Use --> RAGToolkit["Graph RAG Toolkit"]
LLM1 -- Call/Use --> AutogenToolkit["Autogen Toolkit"]
RAGToolkit -- Call/Use --> LanggraphRAG
AutogenToolkit -- Call/Use --> groupOfAgents



LangchainToolkit["Langchain Toolkit"]
LangchainToolkit -- Use --> LangchainAgents

subgraph AzLang["Azure Langchain Agents"]
    style AzLang fill:#FFFFF0,stroke:#333,stroke-width:2px;   
    LangchainAgents["Agents Langchain"]
    LangchainAgents -- Use --> LLM7[LLM]
    
    LLM7 -- Call --> AzureSearch
    LLM7 -- Call --> SQL
    LLM7 -- Call --> Documents
    LLM7 -- API --> Youtube -- Use --> FAISS["FAISS<br>In Memory Vector DB"]
    LLM7 -- Use --> Other["Other Functions.."]

end


LLM1 -- Call/Use --> LangchainToolkit

subgraph RAG["Advanced RAG Agents workflow"]
    style RAG fill:#FFE4E1,stroke:#333,stroke-width:2px;   
    A -- use --> LLM2[LLM]
    D -- use --> LLM3[LLM]
    E -- use --> LLM4[LLM]
    H -- use --> LLM5[LLM]
    LanggraphRAG --> A["Router Agent"]
    A -->|RETRIEVE| C[Retrieve]
    C --> D[Grade Documents Agent]
    C -- Use --> ChromaDB["ChromaDB<br>In Memory Vector DB"]
    A -->|WEBSEARCH| B[Web Search]
    D -->|GENERATE| E["Grade Answer Agent"]
    E --> H[Grade Hallucination Agent]
    H -->|not supported| E
    H -->|useful| G[Generate]
    H -->|not useful| B
    D -->|WEBSEARCH| B
    B -->|GENERATE| E
    B --> Tavily
end

subgraph Autogen["Autogen Agent Groups"]
style Autogen fill:#E0F2F1,stroke:#B2DFDB,stroke-width:4px;

    groupOfAgents["Dynamic Agent Groups"] -- Use --> Proxy["Proxy Agent"]
    Proxy -- Use --> Manager["Manager Agent"]
    Manager -- Use --> Assistants["Assistants Agent"]
    Manager -- Use --> LLM8[LLM]
    Assistants -- use --> AssistantAgentTools
    Assistants --> LLM6[LLM]

    AssistantAgentTools["Agents Toolkit<br> Shared tools used by agents"]

    groupOfAgents["Groups of Agents<br>(Autogen framework)"]
    Assistants["Assistant Agents 1..n"]
    Proxy -- use --> CodeExec
    AssistantAgentTools -- Use --> Functions["Functions or Tools"]
    Functions -- Call/Use --> SYS["System"]
end


TTS["TTS<br>Text to Speech"]
LLM1["LLM<br>Large Language Model"]
Whisper["Whisper<br>Speech to Text"]
CodeExec["code execution<br>Docker"]

Connectorzzz["Connectorzzz SWARM<br> To handle multiple tasks"]
ConnectorzzzAI["Connectorzzz AI<br> AI-based Connector for SWARM"]
ConnectorzzzOmni["Connectorzzz Omni<br> Omnichannel Connector for SWARM"]
PersonaAI["PersonaAI 1..n<br> Multiple personas for different tasks"]
executor["executor<br>Python sandbox"]
Memory["Memory<br>management DB"]
Automation["Code Automations<br> Repositories and pipelines"]
SessionPool["Azure<br>Pool of sessions "]
Github["GitHub<br>Source control and Actions"]

commonTools["Common Toolkit<br> Shared tools used by assistants"]
Web["Web<br> Search engine"]
Dalle3["Dalle3<br>Image generation"]
ImageNet["ImageNet"]


commonTools -- Use --> executor
commonTools -- Use --> Memory
commonTools -- Use --> Automation
commonTools -- Use --> ImageNet
commonTools -- Use --> Web

subgraph CommoTools
Memory -- Call/Use --> MongoAtlas
Automation -- Call/Use --> Github
executor -- Call/Use --> SessionPool
Web -- Call/Use --> Bing
ImageNet -- Use --> Dalle3

end

LLM1 -- use --> commonTools

Connectorzzz -- Contains --> ConnectorzzzAI
Connectorzzz -- Contains --> PersonaAI
Connectorzzz -- Contains --> ConnectorzzzOmni

ConnectorzzzAI -- use --> LLM1
ConnectorzzzOmni -- use --> LLM1
ConnectorzzzOmni -- use --> TTS
ConnectorzzzOmni -- use --> Whisper

classDef grayStyle fill:#E6E6E7,stroke:#FF0000,stroke-width:2px
classDef redStyle fill:#FFCCCC,stroke:#FF0000,stroke-width:2px
classDef pinkStyle fill:#FF88CC,stroke:#FF0000,stroke-width:2px
classDef greenStyle fill:#CCFFCC,stroke:#00FF00,stroke-width:2px
classDef yellowStyle fill:#DDCC12,stroke:#DDCCF2,stroke-width:2px
classDef greyStyle fill:#BB12,stroke:#DDCCF2,stroke-width:2px

%% Applying styles
class User grayStyle
class ConnectorzzzAI,ConnectorzzzOmni,PersonaAI,Assistant redStyle
class Assistants,groupOfAgents,Manager,Proxy,LangchainAgents,LanggraphRAG,A,D,E,H,Agent pinkStyle
class Whisper,TTS,Dalle3,LLM1,LLM2,LLM3,LLM4,LLM5,LLM6,LLM7,LLM8,LFM greenStyle
class commonTools,RAGToolkit,AutogenToolkit,AssistantAgentTools,LangchainToolkit,AgentsAsTools,Toolkit yellowStyle
class SYS,ChromaDB,Youtube,FAISS,Tavily,Bing,AzureSearch,SQL,Documents,Other,System greyStyle

`
};







