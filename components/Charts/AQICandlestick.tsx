'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import surveillanceData from '@/data/surveillance.json';

const AQICandlestick = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#8ba3c7' }
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#8ba3c7' },
      splitLine: { lineStyle: { color: 'rgba(45, 55, 72, 0.1)' } }
    },
    series: [
      {
        type: 'candlestick',
        data: surveillanceData.aqiData,
        itemStyle: {
          color: '#00d4ff',
          color0: '#ff42b3',
          borderColor: '#00d4ff',
          borderColor0: '#ff42b3'
        }
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Seasonal Air Quality Index (AQI)</h3>
        <span className="badge badge-primary font-mono text-[10px]">ECharts Engine</span>
      </div>
      <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

export default AQICandlestick;
