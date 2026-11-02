export class AppError extends Error {
  status: number;

  constructor(mensagem: string, status = 400) {
    super(mensagem);
    this.name = 'AppError';
    this.status = status;
  }
}
