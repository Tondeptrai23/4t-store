
export class AuthenticationError extends Error {
	constructor(message) {
		super(message);
		this.name = "AuthenticationError";
		this.statusCode = 401; // Unauthorized
	}
}

export class DeserializeError extends Error {
	constructor(message) {
		super(message);
		this.name = "DeserializeError";
	}
}

export class ModelError extends Error {
	constructor(message) {
		super(message);
		this.name = "ModelError";
		// this.moreInfo = something else;
	}
}