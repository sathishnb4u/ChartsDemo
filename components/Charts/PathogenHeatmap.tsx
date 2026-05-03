'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import surveillanceData from '@/data/surveillance.json';

const PathogenHeatmap = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = Array.from({ length: 52 }, (_, i) => `W${i + 1}`);

  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    grid: {
      top: '10%',
      bottom: '15%',
      left: '10%',
      right: '5%'
    },
    xAxis: {
      type: 'category',
      data: weeks,
      splitArea: { show: true },
      axisLabel: { color: '#8ba3c7', fontSize: 10 },
      axisLine: { lineStyle: { color: '#2d3748' } }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: '#8ba3c7' },
      axisLine: { lineStyle: { color: '#2d3748' } }
    },
    visualMap: {
      min: 0,
      max: 120,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#151c2c', '#1a365d', '#00d4ff', '#00f29b']
      },
      textStyle: { color: '#8ba3c7' }
    },
    series: [
      {
        name: 'Viral Intensity',
        type: 'heatmap',
        data: surveillanceData.heatmapData,
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h3 className="text-lg font-bold">Wastewater Detection Intensity</h3>
        </div>
        <span className="badge badge-primary font-mono text-[10px]">ECharts Engine</span>
      </div>
      <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

export default PathogenHeatmap;
