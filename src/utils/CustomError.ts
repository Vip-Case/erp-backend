export class CustomError extends Error {
    public statusCode: number;
    public errorCode?: string;
    public meta?: any;

    constructor(message: string, statusCode = 500, errorCode?: string, meta?: any) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.meta = meta;
        // Prototipi açıkça ayarlayın.
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
