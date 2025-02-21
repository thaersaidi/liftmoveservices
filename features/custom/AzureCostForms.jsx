import React from 'react';

const AzureCostForms = ({ azureOneTimeCosts, azureMonthlyCosts, handleAzureOneTimeChange, handleAzureMonthlyChange }) => {
  return (
    <div className="space-y-8">
      
      <form id="azureMonthlyCostsForm" className="space-y-2">
        <h3 className="text-xs font-semibold mb-2">Infra Monthly Costs</h3>
        {Object.keys(azureMonthlyCosts).map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-xs font-medium text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={azureMonthlyCosts[key]}
              onChange={handleAzureMonthlyChange}
              className="mt-1 block w-full text-xs border border-gray-300 rounded-md shadow-sm p-1"
            />
          </div>
        ))}
      </form>
      <form id="azureOneTimeCostsForm" className="space-y-2 mt-4">
        <h3 className="text-xs font-semibold mb-2">One-Time Costs</h3>
        {Object.keys(azureOneTimeCosts).map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-xs font-medium text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={azureOneTimeCosts[key]}
              onChange={handleAzureOneTimeChange}
              className="mt-1 block w-full text-xs border border-gray-300 rounded-md shadow-sm p-1"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default AzureCostForms;