'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import surveillanceData from '@/data/surveillance.json';

const PathogenCorrelation = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 350;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(surveillanceData.correlationData, d => d.viral_load) as number * 1.1])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(surveillanceData.correlationData, d => d.hospitalizations) as number * 1.1])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g').attr('opacity', 0.05).call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''));
    g.append('g').attr('opacity', 0.05).attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSize(-innerHeight).tickFormat(() => ''));

    // Dots
    g.selectAll('circle')
      .data(surveillanceData.correlationData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.viral_load))
      .attr('cy', d => y(d.hospitalizations))
      .attr('r', 5)
      .attr('fill', '#00d4ff')
      .attr('fill-opacity', 0.4)
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('r', 8).attr('fill-opacity', 0.8);
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
            .html(`
              <div class="font-bold text-xs">${d.date}</div>
              <div class="text-[10px] text-text-muted">Load: ${d.viral_load} c/L</div>
              <div class="text-[10px] text-text-muted">Hosp: ${d.hospitalizations}</div>
            `);
        }
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('r', 5).attr('fill-opacity', 0.4);
        d3.select(tooltipRef.current).style('opacity', 0);
      });

    // Regression Line (Simplified)
    const line = d3.line<{ viral_load: number; hospitalizations: number }>()
      .x(d => x(d.viral_load))
      .y(d => y(d.hospitalizations));
    
    // Sort for line
    const sortedData = [...surveillanceData.correlationData].sort((a, b) => a.viral_load - b.viral_load);
    
    // Simple linear regression calculation for a straight line
    const n = sortedData.length;
    const sumX = d3.sum(sortedData, d => d.viral_load);
    const sumY = d3.sum(sortedData, d => d.hospitalizations);
    const sumXY = d3.sum(sortedData, d => d.viral_load * d.hospitalizations);
    const sumX2 = d3.sum(sortedData, d => d.viral_load * d.viral_load);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const xExtent = d3.extent(sortedData, d => d.viral_load) as [number, number];
    const regLineData = [
      { viral_load: xExtent[0], hospitalizations: slope * xExtent[0] + intercept },
      { viral_load: xExtent[1], hospitalizations: slope * xExtent[1] + intercept }
    ];

    g.append('path')
      .datum(regLineData)
      .attr('fill', 'none')
      .attr('stroke', '#ff42b3')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('color', '#8ba3c7');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#8ba3c7');

    // Axis Labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8ba3c7')
      .attr('font-size', '10px')
      .text('Viral Load (copies/L)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8ba3c7')
      .attr('font-size', '10px')
      .text('Regional Hospitalizations');

  }, []);

  return (
    <div className="glass-card p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-secondary rounded-full"></div>
          <h3 className="text-lg font-bold">Wastewater vs. Clinical Impact</h3>
        </div>
        <span className="badge badge-primary font-mono text-[10px]">D3.js ENGINE</span>
      </div>
      <div className="w-full overflow-hidden">
        <svg ref={svgRef} width="100%" height="350" />
      </div>
      <div 
        ref={tooltipRef}
        className="absolute pointer-events-none bg-surface border border-border p-2 rounded-lg shadow-lg opacity-0 z-[100] transition-opacity"
      ></div>
    </div>
  );
};

export default PathogenCorrelation;
