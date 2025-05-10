import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  cnj = '';
  token = '';
  message = '';
  messageColor = '';
  loading = false;

  constructor(private http: HttpClient) {}

  onCnjInput(event: any): void {
    const raw = event.target.value.replace(/\D/g, '').slice(0, 20);

    const part1 = raw.substring(0, 7);
    const part2 = raw.length > 7  ? raw.substring(7, 9)   : '';
    const part3 = raw.length > 9  ? raw.substring(9, 13)  : '';
    const part4 = raw.length > 13 ? raw.substring(13, 14) : '';
    const part5 = raw.length > 14 ? raw.substring(14, 16) : '';
    const part6 = raw.length > 16 ? raw.substring(16, 20) : '';

    let formatted = part1;
    if (part2) formatted += `-${part2}`;
    if (part3) formatted += `.${part3}`;
    if (part4) formatted += `.${part4}`;
    if (part5) formatted += `.${part5}`;
    if (part6) formatted += `.${part6}`;
  
    this.cnj = formatted;
  }

  submit() {
    if (!this.cnj.trim()) {
      this.message = 'Por favor, digite um número CNJ válido.';
      return;
    }
    if (!this.token.trim()) {
      this.message = 'Por favor, informe o token de autenticação.';
      return;
    }
    this.loading = true;
    this.message = '';
    const url = environment.apiUrl;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });

    this.http
      .post<any>(url, { cnj: this.cnj }, { headers, observe: 'response' })
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.message = res.body?.message || 'Consulta enviada com sucesso!';
            this.messageColor = 'success';
          } else {
            this.message =
              res.body?.message || 'Consulta enviada, mas resposta inesperada.';
            this.messageColor = 'error';
          }
          this.loading = false;
        },
        error: (err) => {
          this.message =
            'Erro ao enviar: ' + (err.error?.message || err.message);
          this.messageColor = 'error';
          this.loading = false;
        },
      });
  }
}
