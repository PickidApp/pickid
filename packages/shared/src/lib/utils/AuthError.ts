import { HTTPError } from 'ky';
import { ERROR_CODE } from '../constants';
import { CustomHttpError } from './CustomHttpError';

// ---------- 타입 확인 함수들 ----------
export const checkIsHttpError = (error: unknown): error is HTTPError => {
	return error instanceof HTTPError;
};

export function checkIsCustomHttpError(error: unknown): error is CustomHttpError {
	return error instanceof CustomHttpError;
}

export const checkIsAuthError = (error: unknown): boolean => {
	if (!error || typeof error !== 'object') return false;

	if ('name' in error && error.name === 'AuthApiError') {
		return true;
	}

	if (checkIsHttpError(error)) {
		return (
			error.response.status === ERROR_CODE.UNAUTHORIZED.status || error.response.status === ERROR_CODE.FORBIDDEN.status
		);
	}

	if (error instanceof CustomHttpError) {
		return error.status === ERROR_CODE.UNAUTHORIZED.status || error.status === ERROR_CODE.FORBIDDEN.status;
	}

	return false;
};

// ---------- 메시지 변환 함수 ----------
export const getAuthErrorMessage = (error: unknown): string => {
	if (!error || typeof error !== 'object') {
		return '로그인 중 알 수 없는 오류가 발생했습니다';
	}

	if ('message' in error && typeof error.message === 'string') {
		const message = error.message.toLowerCase();

		if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
			return '이메일 또는 비밀번호가 올바르지 않습니다';
		}

		if (message.includes('email not confirmed')) {
			return '이메일 인증이 완료되지 않았습니다';
		}

		if (message.includes('too many requests')) {
			return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요';
		}

		return error.message;
	}

	return '로그인 중 오류가 발생했습니다';
};
