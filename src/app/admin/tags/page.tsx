import { Card } from '@/components/admin/Card';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/admin/Button';

const tagColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '태그명' },
  { key: 'description', label: '설명' },
  { key: 'usageCount', label: '사용 횟수' },
  { key: 'createdAt', label: '생성일' },
  { key: 'actions', label: '작업' },
];

const mockTags = [
  {
    id: 1,
    name: 'React',
    description: 'React 프레임워크 관련 태그',
    usageCount: 156,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'JavaScript',
    description: 'JavaScript 프로그래밍 언어',
    usageCount: 234,
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: '웹개발',
    description: '웹 개발 전반',
    usageCount: 189,
    createdAt: '2024-01-02',
  },
  {
    id: 4,
    name: '설문조사',
    description: '설문조사 관련',
    usageCount: 67,
    createdAt: '2024-01-03',
  },
  {
    id: 5,
    name: 'UI/UX',
    description: '사용자 인터페이스/경험 디자인',
    usageCount: 98,
    createdAt: '2024-01-04',
  },
  {
    id: 6,
    name: 'NestJS',
    description: 'NestJS 프레임워크',
    usageCount: 45,
    createdAt: '2024-01-05',
  },
];

export default function AdminTagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">태그 관리</h1>
          <p className="text-muted mt-2">게시물 태그를 관리하세요.</p>
        </div>
        <Button>
          새 태그 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="태그 목록">
            <DataTable
              columns={tagColumns}
              data={mockTags}
              renderCell={(row, columnKey) => {
                if (columnKey === 'actions') {
                  return (
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm">
                        편집
                      </Button>
                      <Button variant="danger" size="sm">
                        삭제
                      </Button>
                    </div>
                  );
                }
                if (columnKey === 'name') {
                  return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-white">
                      #{row.name}
                    </span>
                  );
                }
                return row[columnKey as keyof typeof row];
              }}
            />
          </Card>
        </div>

        <div>
          <Card title="태그 통계">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">총 태그 수</span>
                <span className="font-medium">{mockTags.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">가장 많이 사용된 태그</span>
                <span className="font-medium">JavaScript</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">평균 사용 횟수</span>
                <span className="font-medium">
                  {Math.round(mockTags.reduce((sum, tag) => sum + tag.usageCount, 0) / mockTags.length)}
                </span>
              </div>
            </div>
          </Card>

          <Card title="인기 태그" className="mt-6">
            <div className="space-y-3">
              {mockTags
                .sort((a, b) => b.usageCount - a.usageCount)
                .slice(0, 5)
                .map((tag, index) => (
                  <div key={tag.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted">#{index + 1}</span>
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    <span className="text-sm text-muted">{tag.usageCount}회</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
