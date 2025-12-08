interface ResultPageProps {
	params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
	const { id } = await params;

	return (
		<main>
			<h1>테스트 결과</h1>
			<p>테스트 ID: {id}</p>
			{/* TODO: Test Result Page 구현 */}
		</main>
	);
}
