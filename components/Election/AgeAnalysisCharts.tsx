'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import electionData from '@/data/election.json';

export const AgeVoterDistribution = () => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#0f172a' },
      formatter: '{b}: <span style="font-weight:bold; color:#2563eb">{c}%</span>'
    },
    xAxis: {
      type: 'category',
      data: electionData.age_demographics.map(d => d.group),
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontWeight: 'bold' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#64748b', formatter: '{value}%', fontWeight: 'bold' },
      splitLine: { lineStyle: { color: '#e2e8f0' } }
    },
    series: [{
      data: electionData.age_demographics.map(d => ({
        value: d.percentage,
        itemStyle: { color: (d as any).color }
      })),
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0]
      },
      showBackground: true,
      backgroundStyle: { color: 'rgba(0, 0, 0, 0.02)', borderRadius: [6, 6, 0, 0] },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        color: '#0f172a',
        fontSize: 10,
        fontWeight: 'bold'
      }
    }]
  };

  return (
    <div className="glass-card p-6 h-[400px] border-l-8 border-primary">
      <h3 className="text-xl font-black text-foreground mb-6 tracking-tight uppercase">Voter Demographics</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};

export const AgeGroupPartyShare = () => {
  const parties = ['TVK', 'DMK', 'ADMK', 'NTK', 'Others'];
  const colors: Record<string, string> = {
    'TVK': '#9E3A59',
    'DMK': '#C75252',
    'ADMK': '#2E9362',
    'NTK': '#F1C40F',
    'Others': '#94a3b8'
  };

  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#0f172a' }
    },
    legend: {
      data: parties,
      textStyle: { color: '#64748b', fontWeight: 'bold', fontSize: 10 },
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#64748b', formatter: '{value}%', fontWeight: 'bold' },
      splitLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: {
      type: 'category',
      data: electionData.age_vote_share.map(d => d.group),
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#0f172a', fontWeight: '900' }
    },
    series: parties.map(party => ({
      name: party,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: electionData.age_vote_share.map(d => (d as any)[party]),
      itemStyle: { color: colors[party] },
      label: {
        show: true,
        position: 'inside',
        formatter: (params: any) => params.value > 15 ? `${params.value}%` : '',
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold'
      }
    }))
  };

  return (
    <div className="glass-card p-6 h-[400px] border-l-8 border-secondary">
      <h3 className="text-xl font-black text-foreground mb-6 tracking-tight uppercase">Party Share by Age</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};
