import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { PATH } from '@/constants/routes';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AUTH, getAuthErrorMessage } from '@pickid/shared';
import { Button, Input, InputPassword, FormField } from '@pickid/ui';
import { Lock, User } from 'lucide-react';

type LoginFormData = {
	email: string;
	password: string;
};

export function AdminLoginPage() {
	const navigate = useNavigate();
	const { isAdmin, login, loading } = useAdminAuth();
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		defaultValues: {
			email: 'admin@pickid.co.kr',
			password: 'string12#',
		},
	});

	useEffect(() => {
		if (!loading && isAdmin) {
			navigate(PATH.INDEX, { replace: true });
		}
	}, [isAdmin, loading, navigate]);

	const onSubmit = async (data: LoginFormData) => {
		clearErrors();

		const result = await login(data.email, data.password);

		if (!result.success) {
			const errorMessage = getAuthErrorMessage(result.error);
			setError('root', { type: 'manual', message: errorMessage });
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-black mb-2">픽키드 관리자 페이지</h1>
				</div>

				<div className="bg-white rounded-lg border border-neutral-200 p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<FormField label="이메일" htmlFor="email" required>
							<div className="relative">
								<div className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400 pointer-events-none">
									<User className="w-4 h-4" />
								</div>
								<Input
									id="email"
									type="email"
									{...register('email', {
										required: '이메일을 입력해주세요',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: '올바른 이메일 형식이 아닙니다',
										},
									})}
									placeholder={AUTH.PLACEHOLDER_EMAIL}
									autoComplete="email"
									disabled={isSubmitting}
									className={`pl-9 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
								/>
							</div>
							{errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
						</FormField>

						<FormField label="비밀번호" htmlFor="password" required>
							<InputPassword
								id="password"
								{...register('password', {
									required: '비밀번호를 입력해주세요',
									minLength: {
										value: 1,
										message: '비밀번호를 입력해주세요',
									},
								})}
								icon={<Lock className="w-4 h-4" />}
								placeholder={AUTH.PLACEHOLDER_PASSWORD}
								autoComplete="current-password"
								disabled={isSubmitting}
								error={errors.password?.message}
							/>
						</FormField>

						<Button
							type="submit"
							disabled={isSubmitting}
							loading={isSubmitting}
							className="w-full py-2 px-4 rounded-lg font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
							text={isSubmitting ? AUTH.BUTTON_LOGGING_IN : AUTH.BUTTON_LOGIN}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
