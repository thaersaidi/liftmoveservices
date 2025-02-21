export const diagram ="```mermaid\n" +`
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

LLM1 -- use --> commonTools
LLM1 -- Call/Use --> RAGToolkit["RAG Toolkit"]
LLM1 -- Call/Use --> AutogenToolkit["Autogen Toolkit"]
RAGToolkit -- Call/Use --> LanggraphRAG
AutogenToolkit -- Call/Use --> groupOfAgents

commonTools["Common Toolkit<br> Shared tools used by assistants"]
Web["Web<br> Search engine"]
Dalle3["Dalle3<br>Image generation"]
ImageNet["ImageNet"]

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
class Assistants,ConnectorzzzAI,ConnectorzzzOmni,PersonaAI,Assistant redStyle
class groupOfAgents,Manager,Proxy,LangchainAgents,LanggraphRAG,A,D,E,H,Agent pinkStyle
class Whisper,TTS,Dalle3,LLM1,LLM2,LLM3,LLM4,LLM5,LLM6,LLM7,LLM8,LFM greenStyle
class commonTools,RAGToolkit,AutogenToolkit,AssistantAgentTools,LangchainToolkit,AgentsAsTools,Toolkit yellowStyle
class ChromaDB,Youtube,FAISS,Tavily,Bing,AzureSearch,SQL,Documents,Other,System greyStyle
`;

export const jsx = "```jsx\n" +`

import React from 'react';

const ColorSwatch = ({ name, variable }) => (
  <div className="flex items-center mb-2">
    <div 
      className="w-8 h-8 mr-2 rounded" 
      style={{ backgroundColor: \`hsl(var(\${variable}))\` }}
    ></div>
    <span>{name}</span>
  </div>
);

const ThemeSwatches = ({ theme }) => (
  <div className={\`p-4 rounded-lg \${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}\`}>
    <h2 className="text-xl font-bold mb-4">{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</h2>
    <div className={theme}>
      <ColorSwatch name="Background" variable="--background" />
      <ColorSwatch name="Foreground" variable="--foreground" />
      <ColorSwatch name="Primary" variable="--primary" />
      <ColorSwatch name="Primary Foreground" variable="--primary-foreground" />
      <ColorSwatch name="Secondary" variable="--secondary" />
      <ColorSwatch name="Secondary Foreground" variable="--secondary-foreground" />
      <ColorSwatch name="Muted" variable="--muted" />
      <ColorSwatch name="Muted Foreground" variable="--muted-foreground" />
      <ColorSwatch name="Accent" variable="--accent" />
      <ColorSwatch name="Accent Foreground" variable="--accent-foreground" />
      <ColorSwatch name="Destructive" variable="--destructive" />
      <ColorSwatch name="Destructive Foreground" variable="--destructive-foreground" />
      <ColorSwatch name="Border" variable="--border" />
      <ColorSwatch name="Input" variable="--input" />
      <ColorSwatch name="Ring" variable="--ring" />
    </div>
  </div>
);

export default function TailwindColorSwatches() {
  return (
    <div className="flex flex-col space-y-4">
      <ThemeSwatches theme="light" />
      <ThemeSwatches theme="dark" />
    </div>
  );
}
`;

export const html = "```html\n" +`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connectorzzz</title>
</head>
<body>

<header>
    <h1>Connectorzzz</h1>
</header>

<section id="features">
    <h2>Features</h2>
    <ul>
        <li>Manage chat threads and messages.</li>
        <li>Support for multimodal images in chats.</li>
        <li>Citation and document management.</li>
        <li>Azure Chat Completion types for enhanced chatbot functionalities.</li>
    </ul>
</section>

<section id="installation">
    <h2>Installation</h2>
    <p>To get started, clone the repository and install the dependencies:</p>
    <pre>
    <code
git clone https://github.com/thaersaidi/connectorzzz.git
cd connectorzzz
npm install</code></pre>
</section>

<section id="usage">
    <h2>Usage</h2>
    <p>Instructions on how to use the project will go here.</p>
</section>

<section id="documentation">
    <h2>Documentation</h2>
    <p>Links to the full documentation will be provided here.</p>
</section>

<section id="contributing">
    <h2>Contributing</h2>
    <p>Guidelines for contributing to the project will be outlined here.</p>
</section>

<section id="license">
    <h2>License</h2>
    <p>Information about the project's license will be detailed here.</p>
</section>

</body>
</html>

`;

export const markdown = "```markdown\n" +`
# Connectorzzz

This project is designed to facilitate chat interactions and threads, 
utilizing various models and interfaces to structure and manage chat data.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Documentation](#documentation)
5. [Contributing](#contributing)
6. [License](#license)

## Features

- Manage chat threads and messages.
- Support for multimodal images in chats.
- Citation and document management.
- Azure Chat Completion types for enhanced chatbot functionalities.

## Installation

To get started, clone the repository and install the dependencies:

# bash
git clone https://github.com/thaersaidi/connectorzzz.git
cd connectorzzz
npm install
`;