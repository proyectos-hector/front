
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/service/auth.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // Variables de instancia de clase
  user: User | undefined;

  loading: boolean = true;

  /**
   * Inyecta los servicios necesarios para el funcionamiento del componente.
   * @param authService Servicio de autenticación.
   * @param userService Servicio de usuarios.
   */
  constructor(
    public authService: AuthService,
    private userService: UsuarioService,
  ) {}

  /**
   * Inicialización del componente.
   */
  ngOnInit(): void {
    this.getCurrentUser();
  }

  /*
   * Este método se encarga de obtener el usuario actualmente logueado utilizando el servicio de autenticación.
   * Utiliza el método getUser() del servicio de autenticación y se suscribe al mismo para obtener el usuario y asignarlo a la variable "user" de la clase.
   */
  getCurrentUser() {
    this.authService.getUser().subscribe((user: User) => (this.user = user));
  }
}
