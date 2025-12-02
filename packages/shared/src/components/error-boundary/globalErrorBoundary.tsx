import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { checkIsHttpError } from '../../lib/utils/AuthError';

export interface GlobalErrorFallbackProps {
	fallbackPath: string;
	onError?: (error: unknown) => void;
}

export function GlobalErrorFallback({ fallbackPath, onError }: GlobalErrorFallbackProps) {
	const error = useRouteError();
	const navigate = useNavigate();

	useEffect(() => {
		if (error instanceof Error) {
			if (checkIsHttpError(error)) {
				console.error('HTTP 오류 ---> ', error.message);
			}

			if (onError) onError(error);
		}

		navigate(fallbackPath, { replace: true });
	}, [error, fallbackPath, onError, navigate]);

	return null;
}
