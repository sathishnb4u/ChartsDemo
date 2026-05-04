'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import electionData from '@/data/election.json';

export const VoteShareChart = () => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#8ba3c7', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        name: 'Vote Share',
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#151c2c',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
            formatter: '{d}%'
          }
        },
        labelLine: {
          show: false
        },
        data: electionData.vote_share.map(v => ({
          value: v.share,
          name: v.party,
          itemStyle: { 
            color: electionData.party_wise.find(p => p.party === v.party)?.color || '#2d3748' 
          }
        }))
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6">Vote Share Analysis</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};

export const PartyDominationChart = () => {
  const sortedParties = [...electionData.party_wise].sort((a, b) => b.total - a.total);
  
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#8ba3c7', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(45, 55, 72, 0.2)' } }
    },
    yAxis: {
      type: 'category',
      data: sortedParties.map(p => p.party),
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#f0f4f8', fontWeight: 'bold' }
    },
    series: [
      {
        name: 'Won',
        type: 'bar',
        stack: 'total',
        data: sortedParties.map(p => ({
          value: p.won,
          itemStyle: { color: p.color }
        })),
        label: { show: false }
      },
      {
        name: 'Leading',
        type: 'bar',
        stack: 'total',
        data: sortedParties.map(p => ({
          value: p.leading,
          itemStyle: { color: p.color + '88' }
        })),
        itemStyle: {
          borderRadius: [0, 5, 5, 0]
        }
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6">Party-wise Domination (Seats)</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};
