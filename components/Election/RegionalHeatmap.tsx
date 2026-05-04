'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import electionData from '@/data/election.json';

const RegionalHeatmap = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    const regions = electionData.regional_heatmap;
    const cellWidth = (width - margin.left - margin.right) / regions.length;
    
    const colorScale = d3.scaleSequential(d3.interpolatePuBu)
      .domain([0, 100]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const nodes = g.selectAll('g')
      .data(regions)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * cellWidth}, 0)`);

    nodes.append('rect')
      .attr('width', cellWidth - 10)
      .attr('height', height - margin.top - margin.bottom)
      .attr('rx', 12)
      .attr('fill', d => {
        const party = electionData.party_wise.find(p => p.party === d.majority_party);
        return party?.color || '#2d3748';
      })
      .attr('fill-opacity', d => d.intensity / 100)
      .attr('stroke', d => {
        const party = electionData.party_wise.find(p => p.party === d.majority_party);
        return party?.color || '#2d3748';
      })
      .attr('stroke-width', 2);

    nodes.append('text')
      .attr('x', (cellWidth - 10) / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(d => d.region);

    nodes.append('text')
      .attr('x', (cellWidth - 10) / 2)
      .attr('y', 60)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8ba3c7')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text(d => `INTENSITY: ${d.intensity}%`);

    nodes.append('text')
      .attr('x', (cellWidth - 10) / 2)
      .attr('y', (height - margin.top - margin.bottom) - 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', '900')
      .attr('font-size', '20px')
      .text(d => d.majority_party);

    nodes.append('circle')
      .attr('cx', (cellWidth - 10) / 2)
      .attr('cy', (height - margin.top - margin.bottom) / 2)
      .attr('r', d => (d.intensity / 100) * 40)
      .attr('fill', '#fff')
      .attr('fill-opacity', 0.1)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,2');

  }, []);

  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Regional Majority Intensity Heatmap</h3>
        <span className="badge badge-primary text-[10px] font-mono">D3.js SVG Engine</span>
      </div>
      <div className="w-full overflow-hidden">
        <svg ref={svgRef} width="100%" height="350" />
      </div>
    </div>
  );
};

export default RegionalHeatmap;
