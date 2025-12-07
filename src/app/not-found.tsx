import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}


