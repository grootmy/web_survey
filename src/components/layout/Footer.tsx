import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-default mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <h2 className="text-xl font-bold tracking-tight">헤카이브</h2>
            </div>
            <p className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">함께 나누고 성장하는 공간, 당신의 머리카락을 응원합니다.</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark tracking-wider uppercase">바로가기</h3>
              <ul className="mt-4 space-y-4">
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
            {/* <div className="col-span-2 sm:col-span-2">
              <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark tracking-wider uppercase">소셜</h3>
              <div className="flex mt-4 space-x-6 text-text-muted-light dark:text-text-muted-dark">
                <Link href="#" aria-label="Facebook">FB</Link>
                <Link href="#" aria-label="Instagram">IG</Link>
                <Link href="#" aria-label="Twitter">X</Link>
                <Link href="#" aria-label="YouTube">YT</Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-default pt-8 text-center text-sm text-muted">
        <p>© 2025 헤카이브. All rights reserved.</p>
      </div>
    </footer>
  );
}


