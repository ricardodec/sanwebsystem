export class ResponseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ResponseError';
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
};

export class LoginError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LoginError';
        Object.setPrototypeOf(this, LoginError.prototype);
    }
};