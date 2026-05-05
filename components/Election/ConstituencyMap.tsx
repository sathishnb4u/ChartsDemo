'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import electionData from '@/data/election.json';
import tnGeoJSON from '@/data/tn_districts.json';

const ConstituencyMap = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    // Set up D3 Geo Projection
    const projection = d3.geoMercator()
      .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], tnGeoJSON as any);

    const pathGenerator = d3.geoPath().projection(projection);

    // Main Container
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw background grid for cleaner look
    svg.insert('rect', ':first-child')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#ffffff')
      .attr('rx', 24);

    // Draw District Boundaries
    g.selectAll('.district')
      .data((tnGeoJSON as any).features)
      .enter()
      .append('path')
      .attr('class', 'district')
      .attr('d', pathGenerator as any)
      .attr('fill', '#f8fafc')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.9)
      .on('mouseover', function() {
        d3.select(this).attr('fill', '#f1f5f9').attr('stroke', '#94a3b8');
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', '#f8fafc').attr('stroke', '#cbd5e1');
      });

    // Draw markers
    const markers = g.selectAll('.constituency')
      .data(electionData.constituency_results)
      .enter()
      .append('g')
      .attr('class', 'constituency')
      .attr('transform', d => {
        const coords = projection([d.lng, d.lat]);
        return coords ? `translate(${coords[0]}, ${coords[1]})` : 'translate(-100, -100)';
      });

    markers.each(function(d) {
      const markerG = d3.select(this);
      const partyInfo = electionData.party_wise.find(p => p.party === d.winner) || { color: '#94a3b8' };
      const color = partyInfo.color;
      const size = (d.strength / 100) * 12 + 4;

      if (d.type === 'circle') {
        markerG.append('circle')
          .attr('r', size)
          .attr('fill', color)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('class', 'shadow-soft')
          .style('cursor', 'pointer')
          .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 4).attr('r', size + 3);
          })
          .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 2).attr('r', size);
          });
      } else {
        // Diamond shape
        markerG.append('rect')
          .attr('width', size * 1.5)
          .attr('height', size * 1.5)
          .attr('x', -size * 0.75)
          .attr('y', -size * 0.75)
          .attr('fill', color)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('transform', 'rotate(45)')
          .style('cursor', 'pointer');
      }

      // Label
      markerG.append('text')
        .attr('y', -size - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0f172a')
        .attr('font-size', '8px')
        .attr('font-weight', '900')
        .attr('text-transform', 'uppercase')
        .text(d.name);
    });

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 160}, ${margin.top})`);

    electionData.party_wise.slice(0, 6).forEach((p, i) => {
      const legendItem = legend.append('g').attr('transform', `translate(0, ${i * 18})`);
      legendItem.append('circle').attr('r', 5).attr('fill', p.color);
      legendItem.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('fill', '#64748b')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text(p.party);
    });

  }, []);

  return (
    <div className="glass-card p-8 h-full flex flex-col border-t-8 border-primary shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">Geospatial Strength Map</h3>
          <p className="text-text-muted text-sm font-medium">Real-time District-wise Outcome Visualization</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center bg-white rounded-3xl border border-border-soft p-4 relative">
        <svg 
          ref={svgRef} 
          viewBox="0 0 800 600" 
          className="w-full h-full max-h-[500px]"
        />
        <div className="absolute top-6 right-6 flex gap-2">
          {['🔍', '➕', '➖', '🏠'].map((icon, i) => (
            <button key={i} className="w-10 h-10 bg-white border border-border shadow-md rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConstituencyMap;
