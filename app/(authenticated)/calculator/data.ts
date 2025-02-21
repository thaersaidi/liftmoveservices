export const data_modelCosts = {
    'GPT 3.5-16k (FR)': { input: 0.5, output: 1.4, finetune: 0.01, hosting: 1.7 },
    'GPT 4o (SE)': { input: 4.7, output: 14 },
    'GPT 4o Mini': { input: 0.15, output: 0.6 },
    'GPT 4-Turbo-128k (FR)': { input: 9.4, output: 28.1 },
    // 'Mistral Small': { input: 3, output: 1 },
    'Mistral Large': { input: 4, output: 12 },
    'Cohere-command-r': { input: 0.5, output: 1.5 },
    // 'Cohere-command-r-plus': { input: 3, output: 15 },
    'llama-3.1-instruct-8b': { input: 0.3, output: 0.61, finetune: 34.57, hosting: 0.74 },
    // 'llama-3.1-instruct-70b': { input: 3.78, output: 11.34, finetune: 34.57, hosting: 1.23 },
    'llama-3.1-instruct-405b': { input: 5.33, output: 16 },
  };
  
export const data_embeddingCost = 0.13; // Cost per million tokens for text embedding Large

export const data_defaultFormData = {
  usersCount: 20,
  model: 'GPT 4o (SE)',
  messageInput: 200,
  messageOutput: 500,
  tokensPerChunk: 400,
  chunksPerGeneration: 5,
  monthlyGenerations: 600,
  totalDocuments: 150,
  pagesPerDocument: 10,
  tokensPerPage: 500,
  overlap: 100,
  isRecurrent: false,
  trainingHours: 0,
};

export const data_defaultAzureMonthlyCosts = {
  appServiceFrontEnd: 61.51,
  azureAISearch: 68.08,
  azureAIDocumentIntelligence: 25.75,
  azureStorage: 19.3,
  azureMonitor: 146.76,
  azureCosmosDB: 27.34,
  azureApiManagement: 147.17,
  appServiceIndexer: 5.24,
  appServiceExtensions: 3.56,
  extraAiCompute: 0,
};

export const data_defaultAzureOneTimeCosts = {
  initialSetup: 0,
  customizationService: 0,
};

export const data_initFormData = {
  usersCount: 200,
  model: 'GPT 4o (SE)',
  messageInput: 200,
  messageOutput: 500,
  tokensPerChunk: 400,
  chunksPerGeneration: 5,
  monthlyGenerations: 600,
  totalDocuments: 15000,
  pagesPerDocument: 10,
  tokensPerPage: 500,
  overlap: 100,
  isRecurrent: true,
  trainingHours: 0,
};
export const data_initAzureMonthlyCosts = {
  appServiceFrontEnd: 118.92,
  azureAISearch: 226.49,
  azureAIDocumentIntelligence: 36.51,
  azureStorage: 21.28,
  azureMonitor: 216.97,
  azureCosmosDB: 27.34,
  azureApiManagement: 147.17,
  appServiceIndexer: 38.95,
  appServiceExtensions: 59.73,
  extraAiCompute: 0,
};
export const data_initAzureOneTimeCosts = {
  initialSetup: 0,
  customizationService: 0,
}