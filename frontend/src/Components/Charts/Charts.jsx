import DoughnutChart from "../Doughnut"
import { useEffect, useState } from "react";
import { GetOSData } from "../../../wailsjs/go/main/App";
import Series from "../Series/index.jsx";
import './Charts.css';

export default function () {

    const [diskUsageData, setDiskUsageData] = useState([100, 100])
    const [ramUsageData, setRamUsageData] = useState([100, 100])

    const [cpuUsageValues, setCpuUsageValues] = useState(Array(20).fill({
        value: 0,
        label: new Date().toLocaleString()
    }, 0))

    useEffect(() => {
        const interval = setInterval(() => { updateHardwareData() }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, [])

    const updateHardwareData = async () => {
        const { cpu_stats, disk_stats, ram_stats } = await GetOSData();

        setCpuUsageValues(prev => {
            const data = [...prev];
            data.shift()
            return [...data, {
                value: cpu_stats.UsagePercentage,
                label: new Date().toLocaleString()
            }]
        });
        setDiskUsageData([disk_stats.Used, disk_stats.Available])
        setRamUsageData([ram_stats.Used, ram_stats.Available])
    }

    return (
        <>
            <div className={'container'}>
                <div className={'container-vertical'}>
                    <h2>Ram Usage</h2>
                    <DoughnutChart stats={ramUsageData} labels={['Memory used','Memory available']}></DoughnutChart>
                    <div className={'container-vertical'}>
                        <h3>Used memory: {ramUsageData[0].toFixed(2)}GB</h3>
                        <h3>Free memory: {ramUsageData[1].toFixed(2)}GB</h3>
                    </div>
                </div>
                <div>
                    <h2>CPU Usage</h2>
                    <Series stats={cpuUsageValues}></Series>
                    <h3>Usage Percentage: {(cpuUsageValues.reduce((total, next) => total + next.value, 0) / cpuUsageValues.length).toFixed(2)}%</h3>
                </div>
                <div className={'container-vertical'}>
                    <h2>Disk Usage</h2>
                    <DoughnutChart stats={diskUsageData} labels={['Disk used','Disk available']}></DoughnutChart>
                    <div className={'container-vertical'}>
                        <h3>Used storage: {diskUsageData[0].toFixed(2)}GB</h3>
                        <h3>Free storage: {diskUsageData[1].toFixed(2)}GB</h3>
                    </div>
                </div>
            </div>
        </>
    );
}