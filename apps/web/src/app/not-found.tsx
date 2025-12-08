import Link from 'next/link';

export default function NotFound() {
	return (
		<main>
			<h1>페이지를 찾을 수 없어요</h1>
			<p>요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
			<div>
				<Link href="/">홈으로</Link>
			</div>
		</main>
	);
}
