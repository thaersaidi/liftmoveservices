import React from 'react';
import { ReplaceIcon } from 'lucide-react';

const RagCalculatorForm = ({ formData, handleChange, modelCosts, toggleValues }) => {
  return (
    <div className="w-full space-y-8">


      <form id="RagCalculatorForm" className="space-y-2">
      <div>
        <label htmlFor="usersCount" className="block text-xs font-medium  mr-2">
          Users: <b>{formData.usersCount}</b>
        </label>
        <input
          type="range"
          id="usersCount"
          name="usersCount"
          min="20"
          max="1000"
          value={formData.usersCount}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

      </div>
        <div>
          <label htmlFor="model" className="block text-xs font-medium ">
            Model
          </label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="mt-1 block w-full text-xs border border-gray-300 rounded-md shadow-sm p-1"
          >
            {Object.keys(modelCosts).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(formData).filter(key => key !== 'model' && key !== 'isRecurrent' && key !== 'usersCount').map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-xs font-medium ">
              {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="mt-1 block w-full text-xs border border-gray-300 rounded-md shadow-sm p-1"
              disabled={key === 'trainingHours' && !modelCosts[formData.model].finetune}
            />
          </div>
        ))}
        <div>
          <label htmlFor="isRecurrent" className="block text-xs font-medium ">
            Recurrent indexing
          </label>
          <input
            type="checkbox"
            id="isRecurrent"
            name="isRecurrent"
            checked={formData.isRecurrent}
            onChange={handleChange}
            className="mt-1 block"
          />
        </div>
      </form>
    </div>
  );
};

export default RagCalculatorForm;
