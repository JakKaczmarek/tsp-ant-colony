import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { TspService } from './services/tsp-service.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ParametersComponent, VisualizationComponent],
  imports: [BrowserModule, FormsModule],
  providers: [TspService],
  bootstrap: [AppComponent],
})
export class AppModule {}
