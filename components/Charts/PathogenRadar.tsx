'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import surveillanceData from '@/data/surveillance.json';

interface PathogenRadarProps {
  selectedPathogen: string | null;
}

const PathogenRadar = ({ selectedPathogen }: PathogenRadarProps) => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    legend: {
      data: surveillanceData.radarData.map(d => d.name),
      textStyle: { color: '#8ba3c7' },
      bottom: 0,
      selected: selectedPathogen ? { [selectedPathogen]: true } : {}
    },
    radar: {
      indicator: surveillanceData.radarIndicators,
      shape: 'circle',
      splitNumber: 5,
      axisName: { color: '#8ba3c7' },
      splitLine: { lineStyle: { color: 'rgba(45, 55, 72, 0.5)' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(45, 55, 72, 0.5)' } }
    },
    series: [
      {
        name: 'Pathogen Profile',
        type: 'radar',
        data: surveillanceData.radarData.map(d => {
          const isSelected = selectedPathogen === null || selectedPathogen === d.name;
          return {
            value: d.value,
            name: d.name,
            itemStyle: { color: d.color, opacity: isSelected ? 1 : 0.1 },
            lineStyle: { opacity: isSelected ? 1 : 0.1 },
            areaStyle: {
              color: d.color,
              opacity: isSelected ? 0.2 : 0.05
            }
          };
        })
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h3 className="text-lg font-bold">Pathogen Risk Assessment</h3>
        </div>
        <span className="badge badge-primary font-mono text-[10px]">ECharts Engine</span>
      </div>
      <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

export default PathogenRadar;
