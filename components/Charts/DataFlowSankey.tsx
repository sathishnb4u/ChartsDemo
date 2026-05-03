'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import surveillanceData from '@/data/surveillance.json';

const DataFlowSankey = () => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        data: surveillanceData.sankeyData.nodes,
        links: surveillanceData.sankeyData.links,
        emphasis: { focus: 'adjacency' },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
          opacity: 0.2
        },
        label: {
          color: '#f0f4f8',
          fontSize: 12
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#151c2c'
        }
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Scientific Data Flow Network</h3>
        <span className="badge badge-primary font-mono text-[10px]">ECharts Engine</span>
      </div>
      <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default DataFlowSankey;
