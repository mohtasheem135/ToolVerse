// app/components/ClusterPlot.js
'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ClusterPlot({ pixels, colors }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!pixels || !colors) return;

    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    svg.selectAll('*').remove(); // Clear previous plot

    const x = d3.scaleLinear().domain(d3.extent(pixels, (d) => d[0])).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain(d3.extent(pixels, (d) => d[1])).range([height - margin.bottom, margin.top]);

    svg.append('g').attr('transform', `translate(0, ${height - margin.bottom})`).call(d3.axisBottom(x));
    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(y));

    svg.selectAll('circle')
      .data(pixels)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d[0]))
      .attr('cy', (d) => y(d[1]))
      .attr('r', 3)
      .attr('fill', (d) => `rgb(${d[0]}, ${d[1]}, ${d[2]})`);

    // Add color points
    colors.forEach((color) => {
      const rgb = color.match(/\w\w/g).map((x) => parseInt(x, 16));
      svg.append('circle')
        .attr('cx', x(rgb[0]))
        .attr('cy', y(rgb[1]))
        .attr('r', 8)
        .attr('fill', color);
    });
  }, [pixels, colors]);

  return <svg ref={svgRef} width="400" height="400" />;
}