export class CustomError extends Error {
  public statusCode: number;
  public errorCode?: string;
  public meta?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    meta?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = "Kimlik doğrulama hatası", meta?: any) {
    super(message, 401, "AUTHENTICATION_ERROR", meta);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = "Yetkilendirme hatası", meta?: any) {
    super(message, 403, "AUTHORIZATION_ERROR", meta);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = "Doğrulama hatası", meta?: any) {
    super(message, 400, "VALIDATION_ERROR", meta);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Kayıt bulunamadı", meta?: any) {
    super(message, 404, "NOT_FOUND", meta);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Kayıt zaten mevcut", meta?: any) {
    super(message, 409, "CONFLICT", meta);
  }
}

export default CustomError;
