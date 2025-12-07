'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold mb-4">오류가 발생했습니다</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        페이지를 불러오는 중 문제가 발생했습니다.
      </p>
      <button
        onClick={() => reset()}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}


