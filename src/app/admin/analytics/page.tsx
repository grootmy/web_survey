import { Card } from '@/components/admin/Card';

const userGrowthData = [
  { month: '1월', users: 120 },
  { month: '2월', users: 150 },
  { month: '3월', users: 180 },
  { month: '4월', users: 220 },
  { month: '5월', users: 280 },
  { month: '6월', users: 350 },
];

const postCategoryData = [
  { category: '기술', count: 45, percentage: 35 },
  { category: '일반', count: 38, percentage: 29 },
  { category: '설문조사', count: 25, percentage: 19 },
  { category: '공지사항', count: 18, percentage: 14 },
  { category: '기타', count: 6, percentage: 5 },
];

const activityData = [
  { day: '월', posts: 12, comments: 45 },
  { day: '화', posts: 15, comments: 52 },
  { day: '수', posts: 8, comments: 38 },
  { day: '목', posts: 22, comments: 67 },
  { day: '금', posts: 18, comments: 59 },
  { day: '토', posts: 25, comments: 78 },
  { day: '일', posts: 20, comments: 63 },
];

function BarChart({ data, dataKey, labelKey, title }: {
  data: any[];
  dataKey: string;
  labelKey: string;
  title: string;
}) {
  const maxValue = Math.max(...data.map(item => item[dataKey]));

  return (
    <Card title={title}>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-muted">{item[labelKey]}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-bg-soft rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{item[dataKey]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LineChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card title={title}>
      <div className="h-64 flex items-end space-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div
              className="bg-primary rounded-t w-full transition-all duration-500"
              style={{ height: `${(item.users / 400) * 200}px` }}
            />
            <span className="text-xs text-muted">{item.month}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityChart({ data, title }: { data: any[]; title: string }) {
  const maxPosts = Math.max(...data.map(item => item.posts));
  const maxComments = Math.max(...data.map(item => item.comments));

  return (
    <Card title={title}>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-8 text-sm text-muted">{item.day}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted w-12">게시물</span>
                <div className="flex-1 bg-bg-soft rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full"
                    style={{ width: `${(item.posts / maxPosts) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">{item.posts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted w-12">댓글</span>
                <div className="flex-1 bg-bg-soft rounded-full h-3">
                  <div
                    className="bg-success h-3 rounded-full"
                    style={{ width: `${(item.comments / maxComments) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">{item.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">통계 분석</h1>
        <p className="text-muted mt-2">플랫폼의 사용 통계를 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="총 사용자">
          <div className="text-3xl font-bold text-text">1,234</div>
          <div className="text-sm text-success mt-1">+12% 증가</div>
        </Card>
        <Card title="총 게시물">
          <div className="text-3xl font-bold text-text">567</div>
          <div className="text-sm text-success mt-1">+8% 증가</div>
        </Card>
        <Card title="총 댓글">
          <div className="text-3xl font-bold text-text">2,345</div>
          <div className="text-sm text-success mt-1">+15% 증가</div>
        </Card>
        <Card title="총 조회수">
          <div className="text-3xl font-bold text-text">45,678</div>
          <div className="text-sm text-success mt-1">+23% 증가</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={userGrowthData} title="월별 사용자 성장" />
        <BarChart
          data={postCategoryData}
          dataKey="count"
          labelKey="category"
          title="카테고리별 게시물 분포"
        />
      </div>

      <ActivityChart data={activityData} title="요일별 활동량" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="인기 게시물">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted">#{i}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">게시물 제목 {i}</div>
                  <div className="text-xs text-muted">1,234 조회</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="활성 사용자">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  U{i}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">사용자 {i}</div>
                  <div className="text-xs text-muted">최근 활동: 2시간 전</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="시스템 성능">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">서버 응답시간</span>
              <span className="text-sm font-medium">120ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">업타임</span>
              <span className="text-sm font-medium text-success">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">메모리 사용량</span>
              <span className="text-sm font-medium">67%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
