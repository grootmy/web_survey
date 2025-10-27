import { Card } from '@/components/admin/Card';
import { StatCard } from '@/components/admin/StatCard';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">관리자 대시보드</h1>
        <p className="text-muted mt-2">웹 설문조사 플랫폼의 통계를 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 사용자"
          value="1,234"
          change="+12%"
          icon="👥"
        />
        <StatCard
          title="총 게시물"
          value="567"
          change="+8%"
          icon="📝"
        />
        <StatCard
          title="총 댓글"
          value="2,345"
          change="+15%"
          icon="💬"
        />
        <StatCard
          title="총 조회수"
          value="45,678"
          change="+23%"
          icon="👁️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="최근 활동">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-bg-soft rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">새로운 사용자가 가입했습니다</p>
                <p className="text-xs text-muted">2분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-bg-soft rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">새로운 게시물이 작성되었습니다</p>
                <p className="text-xs text-muted">5분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-bg-soft rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">신고가 접수되었습니다</p>
                <p className="text-xs text-muted">10분 전</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="시스템 상태">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">서버 상태</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-success">정상</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">데이터베이스</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-success">정상</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">메모리 사용량</span>
              <span className="text-xs">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">디스크 사용량</span>
              <span className="text-xs">45%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
