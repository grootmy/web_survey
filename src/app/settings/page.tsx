"use client";
import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      setFormData({
        nickname: user.nickname || "",
        bio: user.bio || "",
      });
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(formData);
      setIsEditing(false);
      // 성공 시 formData를 업데이트된 정보로 동기화
      setFormData({
        nickname: updatedUser.nickname || "",
        bio: updatedUser.bio || "",
      });
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      alert("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    setFormData({
      nickname: user?.nickname || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-background-light dark:bg-background-dark rounded mb-4"></div>
            <div className="h-4 bg-background-light dark:bg-background-dark rounded mb-2"></div>
            <div className="h-4 bg-background-light dark:bg-background-dark rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initial = (user.nickname || "U")[0].toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 페이지 헤더 */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight mb-2">계정 설정</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">프로필 정보와 계정 설정을 관리하세요.</p>
      </div>

      {/* 프로필 정보 섹션 */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">프로필 정보</h2>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  onClick={handleSave}
                >
                  저장
                </button>
                <button
                  className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  onClick={handleCancel}
                >
                  취소
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                편집
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start gap-6">
          {/* 프로필 아바타 */}
          <div className="flex-shrink-0">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20 border-2 border-primary/50 flex items-center justify-center text-white text-xl font-bold bg-primary">
              {initial}
            </div>
          </div>

          {/* 프로필 상세 정보 */}
          <div className="flex-1 space-y-6">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">이름</label>
                <div className="text-text-light dark:text-text-dark font-medium">
                  {user.name && user.name.trim() ? user.name : "이름 없음"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">닉네임</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="form-input w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="닉네임을 입력하세요"
                  />
                ) : (
                  <div className="text-text-light dark:text-text-dark font-medium">{user.nickname || "닉네임 없음"}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">이메일</label>
                <div className="text-text-light dark:text-text-dark font-medium">{user.email || "이메일 없음"}</div>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">이메일은 변경할 수 없습니다.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">소개</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="자기소개를 입력하세요"
                    rows={3}
                  />
                ) : (
                  <div className="text-text-light dark:text-text-dark">{user.bio || "소개가 없습니다."}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 계정 설정 섹션 */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-6">계정 설정</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-primary transition-colors">
            <div>
              <h3 className="font-semibold text-text-light dark:text-text-dark">알림 설정</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">이메일 및 푸시 알림을 관리합니다.</p>
            </div>
            <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              설정
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-primary transition-colors">
            <div>
              <h3 className="font-semibold text-text-light dark:text-text-dark">개인정보 보호</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">프로필 공개 범위와 개인정보 설정을 관리합니다.</p>
            </div>
            <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              설정
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-primary transition-colors">
            <div>
              <h3 className="font-semibold text-text-light dark:text-text-dark">보안</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">비밀번호 변경 및 보안 설정을 관리합니다.</p>
            </div>
            <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              설정
            </button>
          </div>
        </div>
      </div>

      {/* 위험 구역 */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-red-200 dark:border-red-800 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">위험 구역</h2>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-light dark:text-text-dark">계정 삭제</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
