import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getCategoryFromDescription } from '../utils/getCategoryFromDescription';

function CashFlowPieChart({ transactions, tabLabel }) {
    const [showDrilldown, setShowDrilldown] = useState(false);

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
        totalIn += t.cashIn || 0;
        totalOut += t.cashOut || 0;

        if (t.cashOut && t.description) {
            const category = getCategoryFromDescription(t.description);
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + t.cashOut;
        }
    });

    const mainChartData = [
        { name: 'Cash In', y: totalIn, color: '#00c49f' },
        {
            name: 'Cash Out',
            y: totalOut,
            color: '#ff8042',
            events: {
                click: () => setShowDrilldown(true)
            }
        }
    ];

    const categoryData = Object.entries(categoryBreakdown).map(([name, y]) => ({
        name,
        y
    }));

    const chartOptions = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: showDrilldown ? '400px' : '300px',
            events: {
                click: () => {
                    if (showDrilldown) setShowDrilldown(false);
                }
            }
        },
        title: {
            text: showDrilldown ? `${tabLabel} Cash Out Flow` : `${tabLabel} Cash Flow Distribution`,
            style: {
                fontSize: '16px',
                color: '#fff'
            }
        },
        tooltip: {
            pointFormat: 'Amount: <b>₹{point.y}</b><br/>Percentage: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: { valueSuffix: '%' }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br/>₹{point.y}<br/>({point.percentage:.1f}%)',
                    style: {
                        color: '#fff',
                        textOutline: 'none',
                        fontSize: '11px'
                    }
                }
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle: {
                fontSize: '12px',
                color: '#fff'
            }
        },
        series: [{
            name: showDrilldown ? 'Category' : 'Amount',
            colorByPoint: true,
            data: showDrilldown ? categoryData : mainChartData
        }],
        credits: {
            enabled: false
        }
    };

    return (
        <div
            style={{
                height: '400px',
                maxWidth: '480px',
                margin: '0 auto',
                transition: 'height 0.3s ease'
            }}
        >
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );

}

export default CashFlowPieChart;
