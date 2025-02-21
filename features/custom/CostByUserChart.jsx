import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/features/ui/card';

const CostByUserChart = ({ usersCount, modelCosts, formData, azureMonthlyCosts }) => {
  const chartData = useMemo(() => {
    const maxUsers = usersCount;
    
     const generateUserCounts = (max) => {
      let counts = [20,30, 40, 60, 80, 100];
      let current = 100;

      while (current <= max) {
        counts= [100, current, current*2, current*3, current*4, current*5];
         if (current >40 ) {
          current +=current, current*2, current*3, current*4, current*5
        }
        else if(current >40  && current <100) {
          current +=current,current*2, current*3, current*4, current*5
        } else if (current < 200 && current >100) {
          current += current,current*2, current*3, current*4, current*5
        } else  {
          current += current,current*2, current*3, current*4, current*5
        }
      }

      return counts;
    };

    const userCounts = generateUserCounts(maxUsers);

    const totalAzureMonthlyCost = Object.values(azureMonthlyCosts).reduce((sum, cost) => sum + cost, 0);

    return userCounts.map(userCount => {
      const dataPoint = { users: userCount };
      Object.entries(modelCosts).forEach(([model, costs]) => {
        const inputCost = (costs.input * formData.messageInput * formData.monthlyGenerations * userCount) / 1000000;
        const outputCost = (costs.output * formData.messageOutput * formData.monthlyGenerations * userCount) / 1000000;
        const modelCost = inputCost + outputCost;
        const totalCost = modelCost + totalAzureMonthlyCost;
        const averageCostPerUser = userCount > 0 ? totalCost / userCount : 0;
        dataPoint[model] = parseFloat(averageCostPerUser.toFixed(2));
      });
      return dataPoint;
    });
  }, [usersCount, modelCosts, formData, azureMonthlyCosts]);

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
    '#d0ed57', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c',
    '#d0ed57', '#ffc658'
  ];

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Average Monthly Cost per User for Different Models</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="users" 
              label={{ value: 'Users', position: 'insideBottomRight', offset: 0 }}
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis 
              label={{ value: 'Monthly Cost ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            {Object.keys(modelCosts).map((model, index) => (
              <Line
                key={model}
                type="monotone"
                dataKey={model}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CostByUserChart;