export class queryError extends Error {
	constructor(message, FHIRIssues) {
		super(message);
		this.name = "FHIRQueryError";
		this.issues = FHIRIssues;
	}
}

export class tokenError extends Error {
	constructor(message) {
		super(message);
		this.name = "TokenError";
	}
}
export class updateError extends Error {
	constructor(message) {
		super(message);
		this.name = "UpdateError";
	}
}

export class timeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = "TimeoutError";
	}
}
