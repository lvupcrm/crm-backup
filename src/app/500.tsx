export default function Error500() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">500</h1>
      <p className="text-lg mb-8">서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
      <a href="/" className="text-blue-600 underline">홈으로 돌아가기</a>
    </main>
  );
} 