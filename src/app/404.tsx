export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">페이지를 찾을 수 없습니다.</p>
      <a href="/" className="text-blue-600 underline">홈으로 돌아가기</a>
    </main>
  );
} 