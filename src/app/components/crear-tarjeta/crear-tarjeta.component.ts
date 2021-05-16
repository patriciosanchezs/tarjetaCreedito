import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/service/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  titulo: string;
  form: FormGroup;
  loading: boolean;
  id: string | undefined;

  constructor(private fb: FormBuilder, private _tarjetaService: TarjetaService,
    private toastr: ToastrService) {
    this.loading = false;
    this.titulo = 'crear tarjeta'
    this.form = fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    })
  }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data => {
      console.log(data);
      this.titulo = 'editar tarjeta';
      this.id = data.id;
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    });
  }

  crearTarjeta() {
    if (this.id === undefined) {
      this.crearTarjeta();
    } else {
      this.editarTarjeta(this.id);
    }

  }

  agregarTarjeta() {
    //CREAMOS NUEVA TARJETA
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._tarjetaService.guardarTarjeta(TARJETA).then(() => {
      this.form.reset();
      this.toastr.success('Tarjeta registrada correctamente', 'Tarjeta registrada');
      this.loading = false;
    }, error => {
      this.toastr.error('No se pudo agregar tarjeta', 'error al ingresar tarjeta');
      this.loading = false;
      console.log(error);
    });
  }

  editarTarjeta(id: string) {
    const TARJETA: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._tarjetaService.editarTarjeta(id, TARJETA).then(()=> {
      this.toastr.info('Tarjeta editada', 'Tarjeta editada correctamente');
      this.loading = false;
      this.titulo = 'agregar tarjeta';
      this.form.reset();
      this.id = undefined;
    }, error => {
      console.log(error);
    });
  }

}
