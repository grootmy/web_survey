import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-default mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <h2 className="text-xl font-bold tracking-tight">헤카이브</h2>
            </div>
            <p className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">함께 나누고 성장하는 공간, 당신의 머리카락을 응원합니다.</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark tracking-wider uppercase">바로가기</h3>
              <ul className="mt-4 space-y-4">
                <li><Link className="text-base text-text-light dark:text-text-dark hover:text-primary" href="/notices">공지사항</Link></li>
                <li><Link className="text-base text-text-light dark:text-text-dark hover:text-primary" href="#">About Us</Link></li>
                <li><Link className="text-base text-text-light dark:text-text-dark hover:text-primary" href="#">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark tracking-wider uppercase">정책</h3>
              <ul className="mt-4 space-y-4">
                <li><Link className="text-base text-text-light dark:text-text-dark hover:text-primary" href="https://www.notion.so/2982e304ee2d8025b456d045d9108b83?source=copy_link" rel="noopener noreferrer" target="_blank">Privacy Policy</Link></li>
                <li><Link className="text-base text-text-light dark:text-text-dark hover:text-primary" href="https://www.notion.so/2982e304ee2d80128b8bfe6ddc580bc3?source=copy_link" rel="noopener noreferrer" target="_blank">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-default pt-8 text-center text-sm text-muted">
        <p>© 2025 헤카이브. All rights reserved.</p>
      </div>
    </footer>
  );
}


