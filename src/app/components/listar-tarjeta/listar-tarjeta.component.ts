import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/service/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent implements OnInit {

  listTarjetas: TarjetaCredito[];
  loading: boolean;

  constructor(private _tarjetaService: TarjetaService,
    private toastr: ToastrService) {
    this.listTarjetas = [];
    this.loading = false;
   }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this._tarjetaService.obtenerTarjetas().subscribe(tarjetas => {
      this.listTarjetas = [];
      tarjetas.forEach((tarjeta: any) => {
        this.listTarjetas.push({
          id: tarjeta.payload.doc.id,
          ...tarjeta.payload.doc.data()
        });
      });
    });

  }

  eliminarTarjeta(id: any) {
    this.loading = true;
    this._tarjetaService.eliminarTarjeta(id).then(()=> {
      this.loading = false;
      this.toastr.success('Tarjeta eliminada correctamente', 'Tarjeta eliminada');
    }, error => {
      this.loading = false;
      this.toastr.error('No se pudo eliminar tarjeta', 'Error al eliminar');
    })
  }

  editarTarjeta(tarjeta: TarjetaCredito) {
    this._tarjetaService.addTarjetaEdit(tarjeta);
  }
}
