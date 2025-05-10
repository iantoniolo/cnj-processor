import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, FormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
