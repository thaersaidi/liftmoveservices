import React from 'react';
import { DollarSign, Cloud, Server, Zap, Database, Layers } from 'lucide-react';

const CostItem = ({ icon: Icon, title, amount, period }) => (
  <div className="flex flex-col items-center p-3 text-white bg-opacity-10 rounded-lg backdrop-blur-lg transition-all duration-300 hover:bg-opacity-20 hover:scale-105">
    <Icon className="w-6 h-6 mb-2" />
    <h3 className="font-semibold text-sm text-center">{title}</h3>
    <p className="text-lg font-bold">${amount}</p>
    <span className="text-xs opacity-75">({period})</span>
  </div>
);

const CostSummary = ({ costs, totalCost }) => {
  return (
    <div className="flex flex-col items-center bg-primary text-white p-4 rounded-lg mb-4 border border-primary/30">
      <div className="flex justify-around mb-4  gap-8">
        <div className="text-center">
          <p className="text-xl bg-foreground/40 font-semibold mb-2">Monthly</p>
          <p className="text-3xl font-bold">${totalCost.monthly.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Yearly</p>
          <p className="text-3xl font-bold">${totalCost.yearly.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">One-Time</p>
          <p className="text-3xl font-bold">${totalCost.oneTime.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <CostItem icon={Server} title="Resources" amount={costs.azureResources} period="Monthly" />
        <CostItem icon={Zap} title="AI Generation" amount={costs.generation} period="Monthly" />
        <CostItem icon={Server} title="Model Hosting" amount={costs.hosting} period="Monthly" />
        {costs.embeddingPeriod === "Monthly" && (
          <CostItem icon={Layers} title="Embedding" amount={costs.embedding} period="Monthly" />
        )}
        {costs.embeddingPeriod === "One-Time" && (
          <CostItem icon={Layers} title="Embedding" amount={costs.embedding} period="One-Time" />
        )}
        <CostItem icon={Database} title="Finetuning" amount={costs.finetuning} period="One-Time" />
        <CostItem icon={Cloud} title="Services" amount={costs.cloudServices} period="One-Time" />
      </div>
    </div>
  );
};

export default CostSummary;
