import { useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { checkIsAuthError, checkIsHttpError } from '../../lib/utils/AuthError';

interface AuthErrorFallbackProps extends FallbackProps {
	loginPath?: string;
	onAuthError?: () => void;
}

const AuthErrorFallback = ({ error, resetErrorBoundary, loginPath = '/auth', onAuthError }: AuthErrorFallbackProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		const reset = async () => {
			if (checkIsAuthError(error)) {
				onAuthError?.();
				navigate(loginPath, { replace: true });
				resetErrorBoundary();
				return;
			} else if (checkIsHttpError(error)) {
				console.error('HTTP 에러:', error);
				// TODO: 인증 에러가 아닌 경우 기본 동작
			} else {
				navigate(loginPath, { replace: true });
			}
		};

		reset();
	}, [error, resetErrorBoundary, navigate, loginPath, onAuthError]);

	return null;
};

export interface AuthErrorBoundaryProps {
	children: React.ReactNode;
	loginPath?: string;
	onAuthError?: () => void;
}

export const AuthErrorBoundary = ({ children, loginPath, onAuthError }: AuthErrorBoundaryProps) => {
	return (
		<ErrorBoundary
			FallbackComponent={(props) => <AuthErrorFallback {...props} loginPath={loginPath} onAuthError={onAuthError} />}
		>
			{children}
		</ErrorBoundary>
	);
};
