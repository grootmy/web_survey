import { Card } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';

const mockCategories = [
  {
    id: 1,
    name: '공지사항',
    description: '중요한 공지사항과 업데이트 정보',
    postCount: 15,
    parentId: null,
  },
  {
    id: 2,
    name: '기술',
    description: '프로그래밍과 기술 관련 게시물',
    postCount: 234,
    parentId: null,
  },
  {
    id: 3,
    name: 'React',
    description: 'React 프레임워크 관련',
    postCount: 89,
    parentId: 2,
  },
  {
    id: 4,
    name: 'Node.js',
    description: 'Node.js 백엔드 개발',
    postCount: 67,
    parentId: 2,
  },
  {
    id: 5,
    name: '설문조사',
    description: '설문조사 게시물',
    postCount: 45,
    parentId: null,
  },
  {
    id: 6,
    name: '일반',
    description: '일반적인 토론과 질문',
    postCount: 123,
    parentId: null,
  },
];

function CategoryItem({ category, level = 0 }: { category: any; level?: number }) {
  const childCategories = mockCategories.filter(cat => cat.parentId === category.id);

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-border hover:bg-bg-soft">
        <div className="flex items-center space-x-3" style={{ paddingLeft: `${level * 20}px` }}>
          {level > 0 && <span className="text-muted">└─</span>}
          <div>
            <h4 className="font-medium text-text">{category.name}</h4>
            <p className="text-sm text-muted">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted">{category.postCount}개 게시물</span>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">
              편집
            </Button>
            <Button variant="danger" size="sm">
              삭제
            </Button>
          </div>
        </div>
      </div>
      {childCategories.map(child => (
        <CategoryItem key={child.id} category={child} level={level + 1} />
      ))}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const rootCategories = mockCategories.filter(cat => cat.parentId === null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">카테고리 관리</h1>
          <p className="text-muted mt-2">게시물 카테고리를 관리하세요.</p>
        </div>
        <Button>
          새 카테고리 추가
        </Button>
      </div>

      <Card title="카테고리 목록">
        <div className="divide-y divide-border">
          {rootCategories.map(category => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </Card>
    </div>
  );
}
