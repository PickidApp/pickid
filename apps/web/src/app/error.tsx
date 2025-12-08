'use client';

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	return (
		<main>
			<h1>문제가 발생했어요</h1>
			<p>잠시 후 다시 시도하거나 홈으로 이동해 주세요.</p>
			{error.digest && <p>에러 코드: {error.digest}</p>}
			<div>
				<button type="button" onClick={reset}>
					다시 시도
				</button>
				<a href="/">홈으로</a>
			</div>
			<p>문제가 계속되면 고객센터로 문의해주세요.</p>
		</main>
	);
}
