'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import surveillanceData from '@/data/surveillance.json';

const PipelineFunnel = () => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Lab Pipeline',
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 12
        },
        itemStyle: {
          borderColor: '#151c2c',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 16
          }
        },
        data: surveillanceData.funnelData,
        color: ['#00d4ff', '#00f29b', '#7042ff', '#ff42b3', '#ffb800']
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Genomic Pipeline Throughput</h3>
        <span className="badge badge-primary font-mono text-[10px]">ECharts Engine</span>
      </div>
      <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

export default PipelineFunnel;
