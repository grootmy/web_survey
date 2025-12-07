import { Card } from '@/components/admin/Card';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/admin/Button';

const commentColumns = [
  { key: 'id', label: 'ID' },
  { key: 'postTitle', label: '게시물' },
  { key: 'author', label: '작성자' },
  { key: 'content', label: '내용' },
  { key: 'status', label: '상태' },
  { key: 'createdAt', label: '작성일' },
  { key: 'actions', label: '작업' },
];

const mockComments = [
  {
    id: 1,
    postTitle: '웹 설문조사 플랫폼 소개',
    author: '김철수',
    content: '정말 유용한 플랫폼이네요! 앞으로 자주 이용하겠습니다.',
    status: '승인됨',
    createdAt: '2024-01-15 14:30',
  },
  {
    id: 2,
    postTitle: 'React 개발 팁 공유',
    author: '이영희',
    content: '좋은 팁 감사합니다. 특히 Hooks 부분이 도움이 되었어요.',
    status: '승인됨',
    createdAt: '2024-01-14 09:15',
  },
  {
    id: 3,
    postTitle: '사용자 경험 설문조사',
    author: '박민수',
    content: '이 설문조사는 부적절한 내용이 포함되어 있습니다.',
    status: '대기중',
    createdAt: '2024-01-13 16:45',
  },
  {
    id: 4,
    postTitle: '일반 토론',
    author: '최지우',
    content: '스팸 댓글입니다. 삭제 부탁드립니다.',
    status: '숨김',
    createdAt: '2024-01-12 11:20',
  },
  {
    id: 5,
    postTitle: '기술 Q&A',
    author: '정현우',
    content: '질문이 있는데 답변 부탁드려요...',
    status: '승인됨',
    createdAt: '2024-01-11 08:30',
  },
];

export default function AdminCommentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">댓글 관리</h1>
          <p className="text-muted mt-2">플랫폼의 댓글을 관리하세요.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary">
            필터
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card title="총 댓글">
          <div className="text-2xl font-bold text-text">{mockComments.length}</div>
        </Card>
        <Card title="승인됨">
          <div className="text-2xl font-bold text-success">
            {mockComments.filter(c => c.status === '승인됨').length}
          </div>
        </Card>
        <Card title="대기중">
          <div className="text-2xl font-bold text-warning">
            {mockComments.filter(c => c.status === '대기중').length}
          </div>
        </Card>
        <Card title="숨김">
          <div className="text-2xl font-bold text-danger">
            {mockComments.filter(c => c.status === '숨김').length}
          </div>
        </Card>
      </div>

      <Card title="댓글 목록">
        <DataTable
          columns={commentColumns}
          data={mockComments}
          renderCell={(row, columnKey) => {
            if (columnKey === 'actions') {
              return (
                <div className="flex space-x-2">
                  {row.status === '대기중' && (
                    <>
                      <Button variant="secondary" size="sm">
                        승인
                      </Button>
                      <Button variant="danger" size="sm">
                        거부
                      </Button>
                    </>
                  )}
                  <Button variant="secondary" size="sm">
                    보기
                  </Button>
                  <Button variant="danger" size="sm">
                    삭제
                  </Button>
                </div>
              );
            }
            if (columnKey === 'status') {
              const statusColors = {
                '승인됨': 'bg-success',
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
            if (columnKey === 'content') {
              return (
                <div className="max-w-xs truncate" title={row.content}>
                  {row.content}
                </div>
              );
            }
            return row[columnKey as keyof typeof row];
          }}
        />
      </Card>
    </div>
  );
}
