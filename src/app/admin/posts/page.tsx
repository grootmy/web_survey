import { Card } from '@/components/admin/Card';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/admin/Button';

const postColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: '제목' },
  { key: 'author', label: '작성자' },
  { key: 'category', label: '카테고리' },
  { key: 'status', label: '상태' },
  { key: 'views', label: '조회수' },
  { key: 'createdAt', label: '작성일' },
  { key: 'actions', label: '작업' },
];

const mockPosts = [
  {
    id: 1,
    title: '웹 설문조사 플랫폼 소개',
    author: '관리자',
    category: '공지사항',
    status: '게시됨',
    views: 1234,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'React 개발 팁 공유',
    author: '김철수',
    category: '기술',
    status: '게시됨',
    views: 567,
    createdAt: '2024-01-14',
  },
  {
    id: 3,
    title: '사용자 경험 설문조사',
    author: '이영희',
    category: '설문조사',
    status: '대기중',
    views: 0,
    createdAt: '2024-01-13',
  },
  {
    id: 4,
    title: '부적절한 게시물',
    author: '박민수',
    category: '일반',
    status: '숨김',
    views: 89,
    createdAt: '2024-01-12',
  },
];

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">게시물 관리</h1>
          <p className="text-muted mt-2">플랫폼의 게시물들을 관리하세요.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary">
            필터
          </Button>
          <Button>
            새 게시물 작성
          </Button>
        </div>
      </div>

      <Card title="게시물 목록">
        <DataTable
          columns={postColumns}
          data={mockPosts}
          renderCell={(row, columnKey) => {
            if (columnKey === 'actions') {
              return (
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    보기
                  </Button>
                  <Button variant="secondary" size="sm">
                    편집
                  </Button>
                  <Button variant="danger" size="sm">
                    삭제
                  </Button>
                </div>
              );
            }
            if (columnKey === 'status') {
              const statusColors = {
                '게시됨': 'bg-success',
                '대기중': 'bg-warning',
                '숨김': 'bg-danger',
              };
              return (
                <span className={`px-2 py-1 text-xs rounded-full text-white ${
                  statusColors[row.status as keyof typeof statusColors] || 'bg-muted'
                }`}>
                  {row.status}
                </span>
              );
            }
            return row[columnKey as keyof typeof row];
          }}
        />
      </Card>
    </div>
  );
}
