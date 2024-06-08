import { Component, OnInit } from '@angular/core';
import { TspService } from '../../services/tsp-service.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
})
export class VisualizationComponent implements OnInit {
  numberOfAnts: number = 50;
  evaporationRate: number = 0.5;
  alpha: number = 1;
  beta: number = 2;

  constructor(private tspService: TspService) {}

  ngOnInit() {
    this.drawChart();
  }

  startSimulation() {
    this.tspService.runAlgorithm();
    this.drawChart();
  }

  resetSimulation() {
    this.tspService.resetAlgorithm();
    this.drawChart();
  }

  applyParameters() {
    this.tspService.setParameters(
      this.numberOfAnts,
      this.evaporationRate,
      this.alpha,
      this.beta
    );
    this.resetSimulation();
  }

  drawChart() {
    const cities = this.tspService.getCities();
    const width = 800;
    const height = 600;

    const xScale = d3
      .scaleLinear()
      .domain([
        Math.min(...cities.map((c) => c.x)),
        Math.max(...cities.map((c) => c.x)),
      ])
      .range([50, width - 50]);

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(...cities.map((c) => c.y)),
        Math.max(...cities.map((c) => c.y)),
      ])
      .range([50, height - 50]);

    d3.select('#chart').selectAll('*').remove();

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    svg
      .selectAll('circle')
      .data(cities)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => xScale(d.x))
      .attr('cy', (d: any) => yScale(d.y))
      .attr('r', 5)
      .attr('fill', 'red');

    svg
      .selectAll('text')
      .data(cities)
      .enter()
      .append('text')
      .attr('x', (d: any) => xScale(d.x))
      .attr('y', (d: any) => yScale(d.y) - 10)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.name)
      .attr('font-size', '10px')
      .attr('fill', 'black');

    svg
      .append('path')
      .attr('d', this.tspService.getPath(xScale, yScale))
      .attr('stroke', 'black')
      .attr('fill', 'none');
  }
}
