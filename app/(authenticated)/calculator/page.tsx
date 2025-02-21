'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ALargeSmall } from "lucide-react";
import { CreateChatWithExtension, FindAllExtensionForCurrentUser } from '@/features/extensions-page/extension-services/extension-service';
import { FindAllChatMessagesForCurrentUser } from '@/features/chat-page/chat-services/chat-message-service';
import { FindAllChatThreadForCurrentUser, FindChatThreadForCurrentUser } from '@/features/chat-page/chat-services/chat-thread-service';
import { FindAllChatDocuments } from '@/features/chat-page/chat-services/chat-document-service';
import { data_modelCosts, data_defaultAzureMonthlyCosts, data_embeddingCost, data_defaultFormData, data_defaultAzureOneTimeCosts, data_initFormData, data_initAzureMonthlyCosts, data_initAzureOneTimeCosts, } from './data';
import { Switch } from "@/features/ui/switch";
import { Label } from "@/features/ui/label";
import ChatBox from '@/features/custom/ChatBox';
import CostSummary from '../../../features/custom/CostSummary';
import AzureCostForms from '../../../features/custom/AzureCostForms';
import RagCalculatorForm from '../../../features/custom/RagCalculatorForm';
import ModelCostTable from '../../../features/custom/ModelCostTable';
import CostByUserChart from '../../../features/custom/CostByUserChart';


const modelCosts = data_modelCosts;
const embeddingCost = data_embeddingCost;

export default function Calculator() {
  const initFormData: any = data_initFormData;
  const defaultFormData: any = data_defaultFormData;
  const defaultAzureMonthlyCosts: any = data_defaultAzureMonthlyCosts;
  const defaultAzureOneTimeCosts: any = data_defaultAzureOneTimeCosts;
  const initAzureMonthlyCosts: any = data_initAzureMonthlyCosts;
  const initAzureOneTimeCosts: any = data_initAzureOneTimeCosts;

  const [formData, setFormData] = useState(defaultFormData);
  const [azureMonthlyCosts, setAzureMonthlyCosts] = useState(defaultAzureMonthlyCosts);
  const [azureOneTimeCosts, setAzureOneTimeCosts] = useState(defaultAzureOneTimeCosts);
  const [totalCost, setTotalCost] = useState({ oneTime: 0, monthly: 0, yearly: 0 });
  const [isDefault, setIsDefault] = useState(true);
  const [isChatFullScreen, setIsChatFullScreen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    updateResults();
  }, [formData, azureMonthlyCosts, azureOneTimeCosts]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (name === 'model' ? value : parseFloat(value)),
    });
  };

  const handleAzureMonthlyChange = (e) => {
    const { name, value } = e.target;
    setAzureMonthlyCosts({
      ...azureMonthlyCosts,
      [name]: parseFloat(value),
    });
  };

  const handleAzureOneTimeChange = (e) => {
    const { name, value } = e.target;
    setAzureOneTimeCosts({
      ...azureOneTimeCosts,
      [name]: parseFloat(value),
    });
  };

  const updateResults = () => {
    const {
      usersCount,
      model,
      totalDocuments,
      pagesPerDocument,
      tokensPerPage,
      tokensPerChunk,
      overlap,
      chunksPerGeneration,
      messageInput,
      messageOutput,
      monthlyGenerations,
      isRecurrent,
      trainingHours,
    } = formData;

    const totalPages = totalDocuments * pagesPerDocument;
    const totalTokens = totalPages * tokensPerPage;
    let totalChunks: any;
    if (tokensPerChunk > overlap) {
      totalChunks = Math.ceil(totalTokens / (tokensPerChunk - overlap));
    } else {
      totalChunks = Math.ceil(totalTokens / tokensPerChunk);
    }
    const totalTokensToEmbed = totalChunks * tokensPerChunk;
    const inputTokensPerGeneration = (chunksPerGeneration * tokensPerChunk) + messageInput;

    const modelCost = modelCosts[model];
    const inputCost = (modelCost.input * inputTokensPerGeneration) / 1000000;
    const outputCost = (modelCost.output * messageOutput) / 1000000;
    const generationCost = inputCost + outputCost;
    const embeddingCostValue = (embeddingCost * totalTokensToEmbed) / 1000000;

    let monthlyCost = generationCost * monthlyGenerations;
    let generationMonthlyCosts = generationCost * monthlyGenerations;

    let oneTimeCost = 0;

    if (isRecurrent) {
      monthlyCost += embeddingCostValue;
    } else {
      oneTimeCost = embeddingCostValue;
    }

    if (modelCost.finetune) {
      oneTimeCost += modelCost.finetune * trainingHours;
    }

    let modelHostingCost = 0;
    if (modelCost.hosting && trainingHours > 0) {
      modelHostingCost = modelCost.hosting * 720;
    }

    const totalAzureMonthlyCost = Object.values(azureMonthlyCosts).reduce((acc, cost) => acc + cost, 0);
    const totalAzureOneTimeCost = Object.values(azureOneTimeCosts).reduce((acc, cost) => acc + cost, 0);
    const totalMonthlyCost = monthlyCost * usersCount+ modelHostingCost + totalAzureMonthlyCost;
    const totalOneTimeCost = oneTimeCost + totalAzureOneTimeCost;
    const totalYearlyCost = totalMonthlyCost * 12;

    setTotalCost({ oneTime: totalOneTimeCost, monthly: totalMonthlyCost, yearly: totalYearlyCost });
  };

  const toggleValues = () => {
    if (isDefault) {
      setFormData(initFormData);
      setAzureMonthlyCosts(initAzureMonthlyCosts);
      setAzureOneTimeCosts(initAzureOneTimeCosts);
    } else {
      setFormData(defaultFormData);
      setAzureMonthlyCosts(defaultAzureMonthlyCosts);
      setAzureOneTimeCosts(defaultAzureOneTimeCosts);
    }
    setIsDefault(!isDefault);
    setIsMaximized(!isMaximized);
  };

  const calculateGenerationCost = () => {
    const modelCost = modelCosts[formData.model];
    const inputTokensPerGeneration = (formData.chunksPerGeneration * formData.tokensPerChunk) + formData.messageInput;
    const inputCost = (modelCost.input * inputTokensPerGeneration) / 1000000;
    const outputCost = (modelCost.output * formData.messageOutput) / 1000000;
    return inputCost + outputCost;
  };

  const calculateEmbeddingCost = () => {
    const totalTokens = formData.totalDocuments * formData.pagesPerDocument * formData.tokensPerPage;
    return (embeddingCost * totalTokens) / 1000000;
  };

  const calculateHostingCost = () => {
    const modelCost: any = modelCosts[formData.model];
    return modelCost.hosting && formData.trainingHours > 0 ? modelCost.hosting * 720 : 0;
  };

  const calculateScaledAzureCosts = () => {
    let scaleFactor = 1;
    let baseAzureCosts;
  
    if (formData.usersCount <= 100) {
      baseAzureCosts = {
        monthlyCosts: defaultAzureMonthlyCosts,
        oneTimeCosts: defaultAzureOneTimeCosts
      };
    } else if (formData.usersCount <= 250) {
      baseAzureCosts = {
        monthlyCosts: initAzureMonthlyCosts,
        oneTimeCosts: initAzureOneTimeCosts
      };
    } else {
      baseAzureCosts = {
        monthlyCosts: initAzureMonthlyCosts,
        oneTimeCosts: initAzureOneTimeCosts
      };
      const additionalHundreds = Math.floor((formData.usersCount - 250) / 100);
      scaleFactor = 1 + additionalHundreds * 0.30;
    }
  
    const azureMonthlyCosts = Object.entries(baseAzureCosts.monthlyCosts).reduce((acc, [key, value]) => {
      acc[key] = value * scaleFactor;
      return acc;
    }, {} as Record<string, number>);
  
    const azureOneTimeCosts = Object.entries(baseAzureCosts.oneTimeCosts).reduce((acc, [key, value]) => {
      acc[key] = value * scaleFactor;
      return acc;
    }, {} as Record<string, number>);
  
    return { azureMonthlyCosts, azureOneTimeCosts };
  };
  

  const costs = {
    usersCount: formData.usersCount,
    cloudServices: Object.values(calculateScaledAzureCosts().azureOneTimeCosts).reduce((acc, cost) => acc + cost, 0).toFixed(2),
    azureResources: Object.values(calculateScaledAzureCosts().azureMonthlyCosts).reduce((acc, cost) => acc + cost, 0).toFixed(2),
    model: formData.model,
    generation: (calculateGenerationCost() * formData.monthlyGenerations * formData.usersCount).toFixed(2),
    finetuning: modelCosts[formData.model].finetune ? (modelCosts[formData.model].finetune * formData.trainingHours).toFixed(2) : 0,
    hosting: calculateHostingCost().toFixed(2),
    embedding: calculateEmbeddingCost().toFixed(4),
    embeddingPeriod: formData.isRecurrent ? 'Monthly' : 'One-Time'
  }

  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [chatData, setChatData] = useState({
    messages: null,
    chatThread: null,
    chatDocuments: null,
    extensions: null,
  });
  const [errors, setErrors] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchChatData() {
      if (!chatId) return;

      try {
        const [chatResponse, chatThreadResponse, docsResponse, extensionResponse] =
          await Promise.all([
            FindAllChatMessagesForCurrentUser(chatId),
            FindChatThreadForCurrentUser(chatId),
            FindAllChatDocuments(chatId),
            FindAllExtensionForCurrentUser(),
          ]);

        if (
          chatResponse.status === "OK" &&
          chatThreadResponse.status === "OK" &&
          docsResponse.status === "OK" &&
          extensionResponse.status === "OK"
        ) {
          setChatData({
            messages: chatResponse.response,
            chatThread: chatThreadResponse.response,
            chatDocuments: docsResponse.response,
            extensions: extensionResponse.response,
          });
        } else {
          const allErrors = [
            ...(chatResponse.errors || []),
            ...(chatThreadResponse.errors || []),
            ...(docsResponse.errors || []),
            ...(extensionResponse.errors || []),
          ];
          setErrors(allErrors);
        }
      } catch (error) {
        setErrors([{ message: "An unexpected error occurred" }]);
      }
    }

    if (isChatboxOpen && chatId) {
      fetchChatData();
    }
  }, [isChatboxOpen, chatId]);

  const toggleChatbox = useCallback(async () => {
    if (!isChatboxOpen) {
      if (!chatId) {
        setIsLoading(true);
        try {
          const defaultExtensionId = "TPvySn19IQFWkZqIqrJt2MDXuB1M1ZEWEbip";
          const allChats = await FindAllChatThreadForCurrentUser();

          // Filter chats by the default extension ID
          const existingChat = allChats.response.find(chat =>
            chat.extension.includes(defaultExtensionId)
          );

          if (existingChat) {
            setChatId(existingChat.id);
          } else {
            const chat = await CreateChatWithExtension(defaultExtensionId);
            if (chat.status === "OK") {
              setChatId(chat.response.id);
            } else {
              setErrors(chat.errors);
            }
          }
          setIsChatboxOpen(true);
        } catch (error) {
          setErrors([{ message: "Failed to create or find a chat" }]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsChatboxOpen(true);
      }
    } else {
      setIsChatboxOpen(false);
    }
  }, [isChatboxOpen, chatId]);

  const toggleChatFullScreen = useCallback(() => {
    setIsChatFullScreen(prev => !prev);
  }, []);


  return (
    <div className="p-8 w-full h-full overflow-auto">
      <div className="max-w-full mx-auto  rounded-xl shadow-md overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-3/8  p-8">
        <h3 className="text-xs font-semibold mb-2">Solution parameters</h3>
        <button 
          type="button" 
          id="toggleButton" 
          onClick={toggleValues} 
          className="bg-primary text-white p-2 rounded-md hover:bg-foreground transition-colors duration-200 mb-4"
        >
          {isMaximized ? <ALargeSmall className='w-8 h-8' /> : <ALargeSmall className='w-4 h-4' />}
        </button>
        <div className="overflow-y-auto" style={{ maxHeight: '85vh' }}>
          <RagCalculatorForm
            formData={formData}
            handleChange={handleChange}
            modelCosts={modelCosts}
            toggleValues={toggleValues}
          />
          </div>
        </div>
        {/* Main Content */}
        <div className="w-full p-8">
          <CostSummary costs={costs} totalCost={totalCost} />

          <CostByUserChart 
            usersCount={formData.usersCount} 
            modelCosts={modelCosts} 
            formData={formData} 
            azureMonthlyCosts={azureMonthlyCosts}
          />

          {/* <div>
            <div className="flex items-center space-x-2 mb-4">
              <Label htmlFor="chart-mode">
                <MessageCircle className="h-4 w-4" />
                Table View ($)
              </Label>
            </div>
            <ModelCostTable modelCosts={modelCosts} formData={formData} />
          </div> */}
        </div>
        <div className="w-3/8  p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
          <AzureCostForms
            azureOneTimeCosts={azureOneTimeCosts}
            azureMonthlyCosts={azureMonthlyCosts}
            handleAzureOneTimeChange={handleAzureOneTimeChange}
            handleAzureMonthlyChange={handleAzureMonthlyChange}
          />
        </div>
      </div>

      <ChatBox
        isChatboxOpen={isChatboxOpen}
        toggleChatbox={toggleChatbox}
        isChatFullScreen={isChatFullScreen}
        toggleChatFullScreen={toggleChatFullScreen}
        errors={errors}
        chatData={chatData}
      />
    </div>
  );
}
