import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  productoForm: FormGroup;
  titulo = 'Crear producto';
  id: string | null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductoService,
    private aRouter: ActivatedRoute) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.esEditar();
  }

  agregarProducto() {
    console.log(this.productoForm.value);
    console.log(this.productoForm.get('producto')?.value);

    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    }

    if (this.id !== null) {
      //editamos producto
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe({
        next: (data: Producto) => {
          this.toastr.info('El producto fue actualizado con exito', 'Producto actualizado');
          this.router.navigate(['/']);
        }, error: (error) => {
          console.log(error);
          this.productoForm.reset();
        }
      })
    } else {
      console.log(PRODUCTO);
      this._productoService.guardarProducto(PRODUCTO).subscribe({
        next: (data: Producto) => {
          this.toastr.success('El producto fue registrado con exito', 'Producto registrado');
          this.router.navigate(['/']);
        }, error: (error) => {
          console.log(error);
          this.productoForm.reset();
        }
      })
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar producto';
      this._productoService.obtenerProducto(this.id).subscribe({
        next: (data: Producto) => {
          this.productoForm.setValue({
            producto: data.nombre,
            categoria: data.categoria,
            ubicacion: data.ubicacion,
            precio: data.precio,
          })
        }, error: err => {
          console.error('Error al obtener el producto', err);
        }
      })
    }
  }
}
