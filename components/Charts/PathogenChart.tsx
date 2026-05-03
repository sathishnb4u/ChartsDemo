'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import surveillanceData from '@/data/surveillance.json';

interface PathogenChartProps {
  selectedPathogen: string | null;
  onPathogenSelect: (name: string | null) => void;
}

interface EChartEventParams {
  componentType?: string;
  seriesName?: string;
  selected?: Record<string, boolean>;
}

const PathogenChart = ({ selectedPathogen, onPathogenSelect }: PathogenChartProps) => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: { type: 'cross', label: { backgroundColor: '#151c2c' } },
      backgroundColor: 'rgba(21, 28, 44, 0.95)',
      borderColor: '#2d3748',
      textStyle: { color: '#f0f4f8' },
      extraCssText: 'box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius: 8px;'
    },
    legend: {
      data: surveillanceData.pathogens.map(p => p.name),
      textStyle: { color: '#8ba3c7' },
      top: 10,
      selectedMode: true // Allow multiple selection in legend
    },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: surveillanceData.pathogens[0].data.map(d => d.date),
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#8ba3c7' }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Viral Load (copies/L)',
        axisLine: { lineStyle: { color: '#2d3748' } },
        axisLabel: { color: '#8ba3c7' },
        splitLine: { lineStyle: { color: '#1e283d' } }
      },
      {
        type: 'value',
        name: 'Percentile',
        min: 0, max: 100,
        axisLine: { lineStyle: { color: '#2d3748' } },
        axisLabel: { color: '#8ba3c7' },
        splitLine: { show: false }
      }
    ],
    series: surveillanceData.pathogens.map(p => ({
      name: p.name,
      type: 'line',
      smooth: true,
      data: p.data.map(d => d.viral_load),
      itemStyle: { color: p.color },
      // Keep opacity at 1 to show all lines as requested, 
      // but we still trigger the filter for other charts on click.
      lineStyle: {
        width: selectedPathogen === p.name ? 4 : 2,
        opacity: selectedPathogen === null || selectedPathogen === p.name ? 1 : 0.3
      },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: p.color + '44' },
            { offset: 1, color: p.color + '00' }
          ]
        },
        opacity: selectedPathogen === null || selectedPathogen === p.name ? 1 : 0.1
      }
    })),
    dataZoom: [{ type: 'inside' }, { start: 0, end: 100, textStyle: { color: '#8ba3c7' } }]
  };

  const onEvents = {
    'click': (params: EChartEventParams) => {
      if (params.componentType === 'series') {
        const name = params.seriesName ?? null;
        onPathogenSelect(name === selectedPathogen ? null : name);
      }
    },
    'legendselectchanged': (params: EChartEventParams) => {
      // We'll just track the selection but ECharts handles visibility
      const selected = params.selected || {};
      const visibleNames = Object.keys(selected).filter(name => selected[name]);
      if (visibleNames.length === 1) {
        onPathogenSelect(visibleNames[0]);
      } else {
        onPathogenSelect(null);
      }
    }
  };

  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold">Pathogen Surveillance Trends</h3>
          {selectedPathogen && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Filtering: {selectedPathogen}
              </span>
              <button 
                onClick={() => onPathogenSelect(null)}
                className="text-[10px] text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-wider"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <span className="badge badge-primary">LIVE DATA</span>
      </div>
      <ReactECharts 
        option={options} 
        onEvents={onEvents}
        style={{ height: '320px', width: '100%' }} 
      />
    </div>
  );
};

export default PathogenChart;
