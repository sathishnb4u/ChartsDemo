'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import surveillanceData from '@/data/surveillance.json';

const SourceTreemap = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 400;

    const root = d3.hierarchy<any>(surveillanceData.treemapData)
      .sum((d: { value?: number }) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap()
      .size([width, height])
      .padding(2)
      (root);

    const color = d3.scaleOrdinal()
      .domain(['Environmental', 'Clinical', 'Genomic Variants'])
      .range(['#00d4ff33', '#7042ff33', '#ff42b333']);

    const stroke = d3.scaleOrdinal()
      .domain(['Environmental', 'Clinical', 'Genomic Variants'])
      .range(['#00d4ff', '#7042ff', '#ff42b3']);

    const nodes = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    nodes.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => color(d.parent?.data.name || '') as string)
      .attr('stroke', d => stroke(d.parent?.data.name || '') as string)
      .attr('stroke-width', 1);

    nodes.append('text')
      .attr('x', 5)
      .attr('y', 15)
      .text(d => d.data.name)
      .attr('font-size', '10px')
      .attr('fill', '#f0f4f8')
      .attr('font-weight', '600');

    nodes.append('text')
      .attr('x', 5)
      .attr('y', 30)
      .text(d => d.value)
      .attr('font-size', '10px')
      .attr('fill', '#8ba3c7');

  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Pathogen Source Hierarchy</h3>
        <span className="badge badge-primary font-mono text-[10px]">D3.js ENGINE</span>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-border">
        <svg ref={svgRef} width="100%" height="400" />
      </div>
    </div>
  );
};

export default SourceTreemap;
