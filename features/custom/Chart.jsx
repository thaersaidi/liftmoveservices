import { Switch } from "@/features/ui/switch";
import { Label } from "@/features/ui/label";
import { BarChart2, Maximize2, MessageCircle, Minimize2, ReplaceIcon, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const toggleChart = () => {
    setShowChart(!showChart);
  };

  const prepareChartData = () => {
    return Object.entries(modelCosts).map(([model, costs]) => {
      const inputCost = (costs.input * formData.messageInput * formData.monthlyGenerations) / 1000000;
      const outputCost = (costs.output * formData.messageOutput * formData.monthlyGenerations) / 1000000;
      const totalMonthlyCost = inputCost + outputCost;
      return {
        name: model,
        'Input Cost': inputCost,
        'Output Cost': outputCost,
        'Monthly Cost': totalMonthlyCost,
        'Yearly Cost': totalMonthlyCost*12,
      };
    });
  };


  const ModelPriceDisplay = () => (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch id="chart-mode" checked={showChart} onCheckedChange={toggleChart} />
        <Label htmlFor="chart-mode">
          {showChart ? <BarChart2 className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
          {showChart ? " Chart View ($)" : " Table View ($)"}
        </Label>
      </div>
      
      {showChart && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={prepareChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Monthly Cost" fill="#314b5f" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  <ModelPriceDisplay />
