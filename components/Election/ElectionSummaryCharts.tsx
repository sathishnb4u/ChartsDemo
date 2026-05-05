'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import electionData from '@/data/election.json';

export const VoteShareChart = () => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: <span style="font-weight:900">{c}%</span>',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 14 }
    },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      textStyle: { color: '#64748b', fontSize: 11, fontWeight: 'bold' },
      itemWidth: 12,
      itemHeight: 12,
      padding: 10
    },
    series: [
      {
        name: 'Vote Share',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#ffffff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          scale: true,
          label: {
            show: true,
            fontSize: 24,
            fontWeight: '900',
            color: '#0f172a',
            formatter: '{d}%'
          }
        },
        labelLine: {
          show: false
        },
        data: electionData.vote_share.map(v => {
          const party = electionData.party_wise.find(p => p.party === v.party) || 
                        { party: 'NTK', color: '#F1C40F' };
          return {
            value: v.share,
            name: v.party,
            itemStyle: { color: v.party === 'Others' ? '#94a3b8' : party.color }
          };
        })
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px] border-l-8 border-primary">
      <h3 className="text-xl font-black text-foreground mb-6 tracking-tight uppercase">Vote Share Analysis</h3>
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
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#0f172a' }
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
      splitLine: { lineStyle: { color: '#e2e8f0' } }
    },
    yAxis: {
      type: 'category',
      data: sortedParties.map(p => p.party),
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { 
        color: '#0f172a', 
        fontWeight: '900',
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Won',
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        data: sortedParties.map(p => ({
          value: p.won,
          itemStyle: { color: p.color }
        })),
        label: { 
          show: true, 
          position: 'insideLeft',
          formatter: '{c}',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 10
        }
      },
      {
        name: 'Leading',
        type: 'bar',
        stack: 'total',
        data: sortedParties.map(p => ({
          value: p.leading,
          itemStyle: { 
            color: p.color,
            opacity: 0.6,
            decal: {
              symbol: 'rect',
              dash: [4, 4],
              rotation: 45
            }
          }
        })),
        itemStyle: {
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => params.value > 0 ? `+${params.value}` : '',
          color: '#64748b',
          fontSize: 10,
          fontWeight: 'bold'
        }
      }
    ]
  };

  return (
    <div className="glass-card p-6 h-[400px] border-l-8 border-secondary">
      <h3 className="text-xl font-black text-foreground mb-6 tracking-tight uppercase">Party-wise Domination</h3>
      <ReactECharts option={options} style={{ height: '300px' }} />
    </div>
  );
};
