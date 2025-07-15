import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryFromDescription } from '../utils/getCategoryFromDescription';
import { useState } from 'react';

const COLORS = ['#00c49f', '#ff8042'];
const CATEGORY_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c', '#d0ed57', '#d88884', '#c0c0c0'
];
const PLACEHOLDER_COLOR = ['#ccc'];

function CashFlowPieChart({ transactions, tabLabel }) {
  const [showCategories, setShowCategories] = useState(false);

  let totalIn = 0;
  let totalOut = 0;

  const categoryBreakdown = {
    Food: 0, Fuel: 0, Grocery: 0, Bills: 0, Transport: 0,
    Entertainment: 0, Medical: 0, Banking: 0, Others: 0,
  };

  transactions.forEach(t => {
    const type = t.type?.toLowerCase();
    const amount = t.amount || 0;
    if (['in', 'cash_in'].includes(type)) totalIn += amount;
    if (['out', 'cash_out'].includes(type)) {
      totalOut += amount;
      const category = getCategoryFromDescription(t.desc || t.description || '');
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
    }
  });

  const mainData = [
    { name: 'Cash In', value: totalIn },
    { name: 'Cash Out', value: totalOut },
  ];
  const hasMainData = totalIn > 0 || totalOut > 0;

  const categoryData = Object.entries(categoryBreakdown)
    .filter(([_, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
  const hasCategoryData = categoryData.length > 0;

  const displayData = showCategories
    ? hasCategoryData ? categoryData : [{ name: 'No Category Data', value: 1 }]
    : hasMainData ? mainData : [{ name: 'No Data Available', value: 1 }];

  const displayColors = showCategories
    ? hasCategoryData ? CATEGORY_COLORS : PLACEHOLDER_COLOR
    : hasMainData ? COLORS : PLACEHOLDER_COLOR;

  return (
    <div
      className="p-3 rounded-3 shadow-sm mb-3"
      style={{
        background: 'linear-gradient(135deg, #232526, #414345)',
        color: '#fff',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <h6 className="text-center text-light mb-2" style={{ fontSize: '0.95rem' }}>
        {showCategories ? `${tabLabel} Cash Out Flow` : `${tabLabel} Cash Flow Distribution`}
      </h6>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={displayData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value, percent }) =>
              name.includes('No') ? name : `${name}: ₹${value} (${(percent * 100).toFixed(1)}%)`
            }
            onClick={() => {
              if (hasMainData || hasCategoryData) setShowCategories(!showCategories);
            }}
          >
            {displayData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={displayColors[index % displayColors.length]}
              />
            ))}
          </Pie>
          {(hasMainData || hasCategoryData) && (
            <Tooltip formatter={(value) => `₹${value}`} />
          )}
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      <p className="text-center text-light" style={{ fontSize: '0.8rem' }}>
        Tap the chart to {showCategories ? 'view overall summary' : 'see category-wise breakdown'}
      </p>
    </div>
  );
}

export default CashFlowPieChart;
