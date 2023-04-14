import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};




export default function ({stats}) {
    console.log(stats)
    const getStats = () => {
        const fixedStats = {
            labels : [],
            data : []
        }

        stats.forEach(item => {
            fixedStats.labels.push(item.label);
            fixedStats.data.push(item.value)
        });

        return fixedStats;
    }

    const fixedStats = getStats();
    const data = {
        labels: fixedStats.labels,
        datasets: [
            {
                label: 'CPU usage',
                data: fixedStats.data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    }
    return <Line options={options} data={data} />;
}
