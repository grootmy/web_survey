import { Card } from '@/components/admin/Card';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/admin/Button';

const userColumns = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: '이메일' },
  { key: 'name', label: '이름' },
  { key: 'role', label: '역할' },
  { key: 'status', label: '상태' },
  { key: 'createdAt', label: '가입일' },
  { key: 'actions', label: '작업' },
];

const mockUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    name: '김철수',
    role: '사용자',
    status: '활성',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    email: 'user2@example.com',
    name: '이영희',
    role: '관리자',
    status: '활성',
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    email: 'user3@example.com',
    name: '박민수',
    role: '사용자',
    status: '비활성',
    createdAt: '2024-01-05',
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">사용자 관리</h1>
          <p className="text-muted mt-2">플랫폼 사용자들을 관리하세요.</p>
        </div>
        <Button>
          새 사용자 추가
        </Button>
      </div>

      <Card title="사용자 목록">
        <DataTable
          columns={userColumns}
          data={mockUsers}
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
            if (columnKey === 'status') {
              return (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  row.status === '활성'
                    ? 'bg-success text-white'
                    : 'bg-muted text-text'
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
