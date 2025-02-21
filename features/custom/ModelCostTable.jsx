import React from 'react';

const ModelCostTable = ({ modelCosts, formData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input Cost/Month</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output Cost/Month</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost/Month</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost/Year</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(modelCosts).map(([model, costs]) => {
            const inputCost = (costs.input * formData.messageInput * formData.monthlyGenerations) / 1000000;
            const outputCost = (costs.output * formData.messageOutput * formData.monthlyGenerations) / 1000000;
            const totalMonthlyCost = inputCost + outputCost;
            const yearlyTotal = totalMonthlyCost * 12;

            return (
              <tr key={model}>
                <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">{model}</td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">{inputCost.toFixed(2)}</td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">{outputCost.toFixed(2)}</td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">{totalMonthlyCost.toFixed(2)}</td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">{yearlyTotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ModelCostTable;