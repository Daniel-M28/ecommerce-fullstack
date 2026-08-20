export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {  // esto hace que cuando se cree un error personalizado, se pueda pasar un mensaje y un código de estado HTTP
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype); 
  }
}