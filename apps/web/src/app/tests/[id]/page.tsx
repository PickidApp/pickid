interface TestPageProps {
	params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: TestPageProps) {
	const { id } = await params;

	return (
		<main>
			<h1>테스트 진행</h1>
			<p>테스트 ID: {id}</p>
			{/* TODO: Test Progress Page 구현 */}
		</main>
	);
}
