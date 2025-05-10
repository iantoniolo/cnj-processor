import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve renderizar o formulário', () => {
    const title = fixture.nativeElement.querySelector('.form-title');
    expect(title.textContent).toContain('Consultar CNJ');
  });

  it('deve aplicar máscara CNJ corretamente', () => {
    const input = { target: { value: '00008321520198010001' } };
    component.onCnjInput(input);
    expect(component.cnj).toBe('0000832-15.2019.8.01.0001');
  });

  it('deve mostrar mensagem de erro se campos estiverem vazios', () => {
    component.cnj = '';
    component.token = '';
    component.submit();
    expect(component.message).toContain('Por favor, digite um número CNJ válido.');
    component.cnj = '0000832-15.2019.8.01.0001';
    component.token = '';
    component.submit();
    expect(component.message).toContain('Por favor, informe o token de autenticação.');
  });

  it('deve mostrar mensagem de sucesso (verde) ao receber status 200', fakeAsync(() => {
    component.cnj = '0000832-15.2019.8.01.0001';
    component.token = 'meutoken';
    component.submit();
    const req = httpMock.expectOne(() => true);
    req.flush({ message: 'Consulta enviada!' }, { status: 200, statusText: 'OK' });
    tick();
    expect(component.messageColor).toBe('success');
    expect(component.message).toContain('Consulta enviada!');
  }));

  it('deve mostrar mensagem de erro (vermelha) ao receber erro', fakeAsync(() => {
    component.cnj = '0000832-15.2019.8.01.0001';
    component.token = 'meutoken';
    component.submit();
    const req = httpMock.expectOne(() => true);
    req.flush({ message: 'Token inválido.' }, { status: 401, statusText: 'Unauthorized' });
    tick();
    expect(component.messageColor).toBe('error');
    expect(component.message).toContain('Token inválido.');
  }));

  it('deve aplicar classe CSS correta no feedback', () => {
    component.message = 'Sucesso!';
    component.messageColor = 'success';
    fixture.detectChanges();
    const p = fixture.debugElement.query(By.css('.form-message'));
    expect(p.nativeElement.classList).toContain('success');
    component.messageColor = 'error';
    fixture.detectChanges();
    expect(p.nativeElement.classList).toContain('error');
  });
});
