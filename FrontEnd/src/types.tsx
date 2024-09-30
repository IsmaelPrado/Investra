export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  es_verificado: boolean;
}

export interface LoginResponse {
  data: {
      mensaje: string; // Cambiado de `message` a `mensaje`
      usuario: Usuario; // La propiedad `usuario` se mantiene
  };
  token: string; // Incluye `token` aquí
}

export interface ApiResponse {
  success: boolean; // Esta propiedad se podría quitar si no está en la respuesta
  data: LoginResponse; // La respuesta debe ser de tipo `LoginResponse`
  message?: string; // Esta propiedad también se podría quitar si no está presente
}
