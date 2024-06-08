import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TspService {
  private cities: { name: string; x: number; y: number }[] = [];
  private pheromones: number[][] = [];
  private numberOfAnts: number = 50;
  private evaporationRate: number = 0.5;
  private alpha: number = 1;
  private beta: number = 2;
  private bestPath: number[] = [];
  private bestDistance: number = Infinity;

  constructor() {
    this.initializeCities();
    this.initializePheromones();
  }

  setParameters(
    numberOfAnts: number,
    evaporationRate: number,
    alpha: number,
    beta: number
  ) {
    this.numberOfAnts = numberOfAnts;
    this.evaporationRate = evaporationRate;
    this.alpha = alpha;
    this.beta = beta;
  }

  initializeCities() {
    this.cities = [
      { name: 'Warszawa', x: 52.2297, y: 21.0122 },
      { name: 'Berlin', x: 52.52, y: 13.405 },
      { name: 'Praga', x: 50.0755, y: 14.4378 },
      { name: 'Wiedeń', x: 48.2082, y: 16.3738 },
      { name: 'Bratysława', x: 48.1486, y: 17.1077 },
      { name: 'Budapeszt', x: 47.4979, y: 19.0402 },
      { name: 'Bukareszt', x: 44.4268, y: 26.1025 },
      { name: 'Sofia', x: 42.6977, y: 23.3219 },
      { name: 'Ateny', x: 37.9838, y: 23.7275 },
      { name: 'Zagrzeb', x: 45.815, y: 15.9819 },
      { name: 'Ljubljana', x: 46.0569, y: 14.5058 },
      { name: 'Rzym', x: 41.9028, y: 12.4964 },
    ];
  }

  initializePheromones() {
    const n = this.cities.length;
    this.pheromones = Array(n)
      .fill(0)
      .map(() => Array(n).fill(1));
  }

  getCities() {
    return this.cities;
  }

  getPath(xScale: any, yScale: any) {
    if (this.bestPath.length === 0) {
      return '';
    }
    const path = this.bestPath
      .map((i) => `${xScale(this.cities[i].x)},${yScale(this.cities[i].y)}`)
      .join(' L ');
    return `M ${path} Z`;
  }

  runAlgorithm() {
    console.log('Rozpoczynam algorytm mrówkowy');
    for (let i = 0; i < this.numberOfAnts; i++) {
      this.simulateAnt();
    }
    console.log('Zakończono algorytm mrówkowy');
  }

  resetAlgorithm() {
    this.bestPath = [];
    this.bestDistance = Infinity;
    this.initializePheromones();
  }

  simulateAnt() {
    const path = this.generatePath();
    const distance = this.calculateDistance(path);
    console.log(`Mrówka wygenerowała trasę: ${path}, odległość: ${distance}`);
    if (distance < this.bestDistance) {
      this.bestDistance = distance;
      this.bestPath = path;
    }
    this.updatePheromones(path, distance);
  }

  generatePath() {
    const n = this.cities.length;
    const path = [Math.floor(Math.random() * n)];
    const visited = new Array(n).fill(false);
    visited[path[0]] = true;

    while (path.length < n) {
      const currentCity = path[path.length - 1];
      const probabilities = this.calculateProbabilities(currentCity, visited);
      const nextCity = this.selectNextCity(probabilities);
      path.push(nextCity);
      visited[nextCity] = true;
    }

    return path;
  }

  calculateProbabilities(currentCity: number, visited: boolean[]) {
    const n = this.cities.length;
    const probabilities = new Array(n).fill(0);
    let sum = 0;

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        probabilities[i] =
          Math.pow(this.pheromones[currentCity][i], this.alpha) *
          Math.pow(
            1 / this.calculateDistanceBetween(currentCity, i),
            this.beta
          );
        sum += probabilities[i];
      }
    }

    for (let i = 0; i < n; i++) {
      probabilities[i] /= sum;
    }

    return probabilities;
  }

  selectNextCity(probabilities: number[]) {
    const rand = Math.random();
    let sum = 0;

    for (let i = 0; i < probabilities.length; i++) {
      sum += probabilities[i];
      if (rand <= sum) {
        return i;
      }
    }

    return probabilities.length - 1;
  }

  calculateDistance(path: number[]) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      distance += this.calculateDistanceBetween(path[i], path[i + 1]);
    }
    distance += this.calculateDistanceBetween(path[path.length - 1], path[0]);
    return distance;
  }

  calculateDistanceBetween(city1: number, city2: number) {
    const dx = this.cities[city1].x - this.cities[city2].x;
    const dy = this.cities[city1].y - this.cities[city2].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  updatePheromones(path: number[], distance: number) {
    const n = this.cities.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.pheromones[i][j] *= 1 - this.evaporationRate;
      }
    }

    for (let i = 0; i < path.length - 1; i++) {
      this.pheromones[path[i]][path[i + 1]] += 1 / distance;
      this.pheromones[path[i + 1]][path[i]] += 1 / distance;
    }
    this.pheromones[path[path.length - 1]][path[0]] += 1 / distance;
    this.pheromones[path[0]][path[path.length - 1]] += 1 / distance;
  }
}
