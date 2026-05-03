'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import surveillanceData from '@/data/surveillance.json';

const VariantEvolution = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 100, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(surveillanceData.variants[0].data, d => new Date(d.date)) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Area generator
    const area = d3.area<{ date: string; share: number }>()
      .x(d => x(new Date(d.date)))
      .y0(y(0))
      .y1(d => y(d.share))
      .curve(d3.curveBasis);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''));

    // Draw areas
    surveillanceData.variants.forEach(variant => {
      g.append('path')
        .datum(variant.data)
        .attr('fill', variant.color as string)
        .attr('fill-opacity', 0.2)
        .attr('stroke', variant.color as string)
        .attr('stroke-width', 2)
        .attr('d', area);

      // Labels at the end
      const lastPoint = variant.data[variant.data.length - 1];
      g.append('text')
        .attr('x', x(new Date(lastPoint.date)) + 5)
        .attr('y', y(lastPoint.share))
        .attr('fill', variant.color as string)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('alignment-baseline', 'middle')
        .text(variant.name);
    });

    // Tooltip elements
    const focusLine = g.append('line')
      .attr('stroke', '#8ba3c7')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('opacity', 0);

    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all');

    overlay
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const date = x.invert(mx);
        
        // Find nearest data point (since all series have same dates)
        const bisect = d3.bisector((d: { date: string }) => new Date(d.date)).left;
        const index = bisect(surveillanceData.variants[0].data, date);
        const d0 = surveillanceData.variants[0].data[index - 1];
        const d1 = surveillanceData.variants[0].data[index];
        const d = !d0 ? d1 : (!d1 ? d0 : (date.getTime() - new Date(d0.date).getTime() > new Date(d1.date).getTime() - date.getTime() ? d1 : d0));

        if (!d) return;

        const posX = x(new Date(d.date));
        focusLine.attr('x1', posX).attr('x2', posX).style('opacity', 1);

        if (tooltipRef.current) {
          const tooltipData = surveillanceData.variants.map(v => {
            const point = v.data.find(pd => pd.date === d.date);
            return { name: v.name, share: point?.share.toFixed(1), color: v.color };
          });

          const tooltipHtml = `
            <div style="font-weight: bold; margin-bottom: 5px; font-size: 11px;">${d.date}</div>
            ${tooltipData.map(td => `
              <div style="display: flex; align-items: center; gap: 8px; font-size: 11px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${td.color};"></div>
                <div style="flex: 1;">${td.name}</div>
                <div style="font-weight: bold;">${td.share}%</div>
              </div>
            `).join('')}
          `;

          d3.select(tooltipRef.current)
            .style('opacity', 1)
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 10}px`)
            .html(tooltipHtml);
        }
      })
      .on('mouseleave', () => {
        focusLine.style('opacity', 0);
        d3.select(tooltipRef.current).style('opacity', 0);
      });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('color', '#8ba3c7');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .attr('color', '#8ba3c7');

  }, []);

  return (
    <div className="glass-card p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-secondary rounded-full"></div>
          <h3 className="text-lg font-bold">Variant Prevalence (Genomic)</h3>
        </div>
        <span className="badge badge-primary font-mono">D3.js ENGINE</span>
      </div>
      <div className="w-full overflow-hidden">
        <svg ref={svgRef} width="100%" height="300" />
      </div>
      <div 
        ref={tooltipRef}
        className="absolute pointer-events-none bg-surface border border-border p-3 rounded-xl shadow-lg opacity-0 z-[100] min-w-[150px]"
        style={{ transition: 'opacity 0.2s' }}
      ></div>
    </div>
  );
};

export default VariantEvolution;
