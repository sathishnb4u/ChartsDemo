'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import electionData from '@/data/election.json';

export const AgeVoterDistribution = () => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    xAxis: {
      type: 'category',
      data: electionData.age_demographics.map(d => d.group),
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#8ba3c7' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8ba3c7', formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(45, 55, 72, 0.2)' } }
    },
    series: [{
      data: electionData.age_demographics.map(d => d.percentage),
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#00d4ff' }, { offset: 1, color: '#7042ff' }]
        },
        borderRadius: [8, 8, 0, 0]
      },
      showBackground: true,
      backgroundStyle: { color: 'rgba(180, 180, 180, 0.05)', borderRadius: [8, 8, 0, 0] }
    }]
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6">Voters based on Age Group</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};

export const AgeGroupPartyShare = () => {
  const parties = ['TVK', 'DMK', 'ADMK', 'NTK', 'Others'];
  const colors = {
    'TVK': '#ff42b3',
    'DMK': '#ffb800',
    'ADMK': '#00f29b',
    'NTK': '#7042ff',
    'Others': '#2d3748'
  };

  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      stackIntersection: false,
      backgroundColor: '#151c2c',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' }
    },
    legend: {
      data: parties,
      textStyle: { color: '#8ba3c7' },
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#8ba3c7', formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(45, 55, 72, 0.2)' } }
    },
    yAxis: {
      type: 'category',
      data: electionData.age_vote_share.map(d => d.group),
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#8ba3c7' }
    },
    series: parties.map(party => ({
      name: party,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: electionData.age_vote_share.map(d => (d as any)[party]),
      itemStyle: { color: (colors as any)[party] }
    }))
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6">Party Preference by Age</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};
