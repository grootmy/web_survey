"use client";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight mb-8 text-center">프로필 정보 입력</h1>
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8">
        <form onSubmit={(e) => { e.preventDefault(); router.push("/"); }}>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-6">기본 정보</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark" htmlFor="nickname">닉네임</label>
                  <div className="mt-1 flex gap-2">
                    <input className="form-input flex-grow bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary" id="nickname" name="nickname" placeholder="예: 탈모극복러" type="text" />
                    <button className="bg-primary text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 whitespace-nowrap" type="button">닉네임 중복 검사</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark" htmlFor="age">나이</label>
                  <div className="mt-1">
                    <input className="form-input w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary" id="age" name="age" placeholder="만 나이" type="number" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">성별</label>
                  <div className="mt-2 flex items-center space-x-6 h-10">
                    <label className="inline-flex items-center gap-2 text-sm"><input className="form-radio h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" name="gender" type="radio" /> 남성</label>
                    <label className="inline-flex items-center gap-2 text-sm"><input className="form-radio h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" name="gender" type="radio" /> 여성</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-6">탈모 정보</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark" htmlFor="hair-loss-type">탈모 유형</label>
                  <div className="mt-1">
                    <select className="form-select w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary" id="hair-loss-type" name="hair-loss-type">
                      <option>선택하세요</option>
                      <option>M자형 탈모</option>
                      <option>O자형 탈모(정수리)</option>
                      <option>C자형 탈모</option>
                      <option>복합형 탈모</option>
                      <option>원형 탈모</option>
                      <option>기타</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark" htmlFor="hair-loss-duration">탈모 진행 기간</label>
                  <div className="mt-1">
                    <select className="form-select w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary" id="hair-loss-duration" name="hair-loss-duration">
                      <option>선택하세요</option>
                      <option>6개월 미만</option>
                      <option>6개월 - 1년</option>
                      <option>1년 - 3년</option>
                      <option>3년 - 5년</option>
                      <option>5년 이상</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark" htmlFor="treatments">현재 치료 및 관리 방법</label>
                <div className="mt-2 space-y-2">
                  {['약물 복용','바르는 약','탈모 완화 샴푸','두피 클리닉','모발 이식'].map((label, i) => (
                    <label key={i} className="inline-flex items-center gap-2 w-full text-sm">
                      <input className="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-primary" type="checkbox" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
            <button className="px-6 py-2.5 text-sm font-semibold text-text-muted-light dark:text-text-muted-dark bg-background-light dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 border border-border-light dark:border-border-dark" type="button" onClick={() => router.back()}>취소</button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors duration-200" type="submit">저장하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}


