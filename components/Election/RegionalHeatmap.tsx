'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import electionData from '@/data/election.json';
import tnGeoJSON from '@/data/tn_districts.json';

const RegionalHeatmap = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Projection
    const projection = d3.geoMercator()
      .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], tnGeoJSON as any);

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw TN Districts as Background
    g.selectAll('.district')
      .data((tnGeoJSON as any).features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', '#f8fafc')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.8);

    // Regional Intensity Markers
    const regionGeoCenters: Record<string, { lng: number, lat: number }> = {
      'North': { lng: 79.2, lat: 12.5 },
      'Central': { lng: 78.6, lat: 10.8 },
      'West': { lng: 77.2, lat: 11.0 },
      'South': { lng: 77.8, lat: 9.3 },
      'Delta': { lng: 79.3, lat: 10.5 }
    };

    const regionGroups = g.selectAll('.region-group')
      .data(electionData.regional_heatmap)
      .enter()
      .append('g')
      .attr('class', 'region-group')
      .attr('transform', d => {
        const center = regionGeoCenters[d.region];
        const coords = projection([center.lng, center.lat]);
        return coords ? `translate(${coords[0]}, ${coords[1]})` : 'translate(-100, -100)';
      });

    regionGroups.each(function(d) {
      const regionG = d3.select(this);
      const color = d.color || '#94a3b8';
      const radius = (d.intensity / 100) * 40 + 10;

      // Glow effect
      regionG.append('circle')
        .attr('r', radius)
        .attr('fill', color)
        .attr('opacity', 0.15)
        .attr('class', 'animate-pulse');

      // Core bubble
      regionG.append('circle')
        .attr('r', 8)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('class', 'shadow-lg');

      // Label
      regionG.append('text')
        .attr('y', -radius - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0f172a')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .attr('text-transform', 'uppercase')
        .text(d.region);

      // Dominance Text
      regionG.append('text')
        .attr('y', -radius - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text(`${d.majority_party} ${d.intensity}%`);
    });

  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col border-t-8 border-secondary shadow-xl overflow-hidden bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-black text-foreground tracking-tighter uppercase">Regional Majority Heatmap</h3>
        <p className="text-text-muted text-xs font-medium italic">Geographic Intensity of Political Sentiment</p>
      </div>
      <div className="flex-1 flex justify-center items-center bg-slate-50/50 rounded-2xl border border-border-soft overflow-hidden">
        <svg ref={svgRef} viewBox="0 0 800 350" className="w-full h-full" />
      </div>
    </div>
  );
};

export default RegionalHeatmap;
