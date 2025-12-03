import { HTTPError } from 'ky';
import { ERROR_CODE } from '../constants';

export interface CustomHttpErrorBody {
	errorTraceId: string;
	type: keyof typeof ERROR_CODE;
	detail: string;
}

export class CustomHttpError extends Error {
	public errorTraceId: string;
	public type: CustomHttpErrorBody['type'];
	public detail: string;

	public request: HTTPError['request'];
	public response: HTTPError['response'];

	public status: number;

	constructor(httpError: HTTPError, body: CustomHttpErrorBody) {
		super(body.detail || httpError.message);

		this.name = 'CustomHttpError';

		this.errorTraceId = body.errorTraceId;
		this.type = body.type;
		this.detail = body.detail;
		this.status = httpError.response.status;

		this.request = httpError.request;
		this.response = httpError.response;
	}
}

