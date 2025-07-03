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
        Food: 0,
        Fuel: 0,
        Grocery: 0,
        Bills: 0,
        Transport: 0,
        Entertainment: 0,
        Medical: 0,
        Banking: 0,
        Others: 0
    };

    transactions.forEach(t => {
        const amount = t.amount || 0;
        if (t.type === 'in') totalIn += amount;
        if (t.type === 'out') {
            totalOut += amount;
            const category = getCategoryFromDescription(t.desc || '');
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
        }
    });

    const mainData = [
        { name: 'Cash In', value: totalIn },
        { name: 'Cash Out', value: totalOut }
    ];

    const hasMainData = totalIn > 0 || totalOut > 0;

    const categoryData = Object.entries(categoryBreakdown)
        .filter(([_, v]) => v > 0)
        .map(([name, value]) => ({ name, value }));

    const hasCategoryData = categoryData.length > 0;

    const displayData = showCategories
        ? hasCategoryData
            ? categoryData
            : [{ name: 'No Category Data', value: 1 }]
        : hasMainData
            ? mainData
            : [{ name: 'No Data Available', value: 1 }];

    const displayColors = showCategories
        ? hasCategoryData
            ? CATEGORY_COLORS
            : PLACEHOLDER_COLOR
        : hasMainData
            ? COLORS
            : PLACEHOLDER_COLOR;

    return (
        <div className="p-2" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h6 className="text-center text-secondary">
                {showCategories ? `${tabLabel} Cash Out Flow` : `${tabLabel} Cash Flow Distribution`}
            </h6>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={displayData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value, percent }) =>
                            name.includes('No Data')
                                ? name
                                : `${name}: ₹${value} (${(percent * 100).toFixed(1)}%)`
                        }
                        onClick={() => {
                            if (hasMainData || hasCategoryData) {
                                setShowCategories(!showCategories);
                            }
                        }}
                    >
                        {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={displayColors[index % displayColors.length]} />
                        ))}
                    </Pie>
                    {hasMainData || hasCategoryData ? <Tooltip formatter={(value) => `₹${value}`} /> : null}
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>

            <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
                Tap the chart to {showCategories ? 'view overall summary' : 'see category-wise breakdown'}
            </p>
        </div>
    );
}

export default CashFlowPieChart;
