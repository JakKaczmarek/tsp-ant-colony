import { Component } from '@angular/core';
import { TspService } from '../../services/tsp-service.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent {
  numberOfAnts: number = 50;
  evaporationRate: number = 0.5;
  alpha: number = 1;
  beta: number = 2;

  constructor(private tspService: TspService) {}

  applyParameters() {
    this.tspService.setParameters(
      this.numberOfAnts,
      this.evaporationRate,
      this.alpha,
      this.beta
    );
  }
}
