import { data_modelCosts, data_defaultAzureMonthlyCosts, data_defaultAzureOneTimeCosts, data_defaultFormData, 
    data_embeddingCost, data_initAzureMonthlyCosts, data_initAzureOneTimeCosts, data_initFormData
 } from "@/app/(authenticated)/calculator/data";

// Types
type ModelCost = {
  input: number;
  output: number;
  finetune?: number;
  hosting?: number;
};

type ModelCosts = {
  [key: string]: ModelCost;
};

type AzureCosts = {
  [key: string]: number;
};

type aiFormData = {
  usersCount: number;
  model: string;
  messageInput: number;
  messageOutput: number;
  tokensPerChunk: number;
  chunksPerGeneration: number;
  monthlyGenerations: number;
  totalDocuments: number;
  pagesPerDocument: number;
  tokensPerPage: number;
  overlap: number;
  isRecurrent: boolean;
  trainingHours: number;
};

type CostData = {
  modelCosts: ModelCosts;
  embeddingCost: number;
  defaultFormData: aiFormData;
  defaultAzureMonthlyCosts: AzureCosts;
  defaultAzureOneTimeCosts: AzureCosts;
  initFormData: aiFormData;
  initAzureMonthlyCosts: AzureCosts;
  initAzureOneTimeCosts: AzureCosts;
};

// Function to extract data
export function get_azure_rag_costs(): CostData {
  return {
    modelCosts: data_modelCosts,
    embeddingCost: data_embeddingCost,
    defaultFormData: data_defaultFormData,
    defaultAzureMonthlyCosts: data_defaultAzureMonthlyCosts,
    defaultAzureOneTimeCosts: data_defaultAzureOneTimeCosts,
    initFormData: data_initFormData,
    initAzureMonthlyCosts: data_initAzureMonthlyCosts,
    initAzureOneTimeCosts: data_initAzureOneTimeCosts,
  };
}

export function get_azure_rag_calculate_costs(inputData: Partial<aiFormData> = {}) {
    const costData = get_azure_rag_costs();
    const defaultFormData = costData.defaultFormData;
    
    // Merge input data with default data
    const aiFormData: aiFormData = { ...defaultFormData, ...inputData };
  
    const { modelCosts, embeddingCost } = costData;
    
    // Determine which set of Azure costs to use as a base and calculate the scaling factor
    let baseAzureCosts;
    let scaleFactor = 1;

    if (aiFormData.usersCount <= 100) {
        baseAzureCosts = {
            monthlyCosts: costData.defaultAzureMonthlyCosts,
            oneTimeCosts: costData.defaultAzureOneTimeCosts
        };
    } else if (aiFormData.usersCount <= 250) {
        baseAzureCosts = {
            monthlyCosts: costData.initAzureMonthlyCosts,
            oneTimeCosts: costData.initAzureOneTimeCosts
        };
    } else {
        baseAzureCosts = {
            monthlyCosts: costData.initAzureMonthlyCosts,
            oneTimeCosts: costData.initAzureOneTimeCosts
        };
        const additionalHundreds = Math.floor((aiFormData.usersCount - 250) / 100);
        scaleFactor = 1 + additionalHundreds * 0.30;
    }
  
    // Scale Azure monthly costs based on the new scaling factor
    const azureMonthlyCosts = Object.entries(baseAzureCosts.monthlyCosts).reduce((acc, [key, value]) => {
      acc[key] = value * scaleFactor;
      return acc;
    }, {} as AzureCosts);
    
    // Keep Azure one-time costs the same
    const azureOneTimeCosts = { ...baseAzureCosts.oneTimeCosts };
  
    const calculateGenerationCost = () => {
      const modelCost = modelCosts[aiFormData.model];
      const inputTokensPerGeneration = (aiFormData.chunksPerGeneration * aiFormData.tokensPerChunk) + aiFormData.messageInput;
      const inputCost = (modelCost.input * inputTokensPerGeneration) / 1000000;
      const outputCost = (modelCost.output * aiFormData.messageOutput) / 1000000;
      return inputCost + outputCost;
    };
  
    const calculateEmbeddingCost = () => {
      const totalTokens = aiFormData.totalDocuments * aiFormData.pagesPerDocument * aiFormData.tokensPerPage;
      return (embeddingCost * totalTokens) / 1000000;
    };
  
    const calculateHostingCost = () => {
      const modelCost = modelCosts[aiFormData.model];
      return modelCost.hosting && aiFormData.trainingHours > 0 ? modelCost.hosting * 720 : 0;
    };
  
    const costs = {
      usersCount: aiFormData.usersCount,
      cloudServices: Object.values(azureOneTimeCosts).reduce((acc, cost) => acc + cost, 0),
      azureResources: Number(Object.values(azureMonthlyCosts).reduce((acc, cost) => acc + cost, 0).toFixed(2)),
      model: aiFormData.model,
      generation: Number((calculateGenerationCost() * aiFormData.monthlyGenerations * aiFormData.usersCount).toFixed(2)),
      finetuning: modelCosts[aiFormData.model].finetune ? Number((modelCosts[aiFormData.model].finetune! * aiFormData.trainingHours).toFixed(2)) : 0,
      hosting: Number(calculateHostingCost().toFixed(2)),
      embedding: Number(calculateEmbeddingCost().toFixed(4)),
      embeddingPeriod: aiFormData.isRecurrent ? 'Monthly' : 'One-Time'
    };
  
    // Return both the calculated costs and all relevant input parameters
    return {
      costs,
      inputParameters: {
        ...aiFormData,
        azureOneTimeCosts,
        azureMonthlyCosts
      }
    };
}
