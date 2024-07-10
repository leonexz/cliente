import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements OnInit {
  listProductos:Producto[]=[];

  constructor(private _productoService: ProductoService,
    private toastr:ToastrService) {}
  
  ngOnInit(): void {
      this.obtenerProductos();
    }
    obtenerProductos(): void {
      this._productoService.getProductos().subscribe({
        next: (data: Producto[]) => {
          console.log(data);
          this.listProductos = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    eliminarProducto(id:any){
      this._productoService.eliminarProducto(id).subscribe({
      next:(data:Producto[])=>{
        this.toastr.error('El producto fue eliminado con exito','Producto eliminado');
        this.obtenerProductos();
      },error:(error)=>{
        console.log(error);
      }
      })
    }
  }

