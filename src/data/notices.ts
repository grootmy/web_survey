import type { Notice } from "@/types/notice";

export const notices: Notice[] = [
  {
    slug: 'community-guidelines-update',
    title: '커뮤니티 이용 수칙 개정 안내',
    summary: '건강한 커뮤니티 유지를 위한 신고/제재 절차와 게시글 작성 규칙이 11월 1일부터 개편됩니다.',
    content: `안녕하세요, 헤카이브 운영팀입니다.

건강한 소통 공간을 위해 커뮤니티 이용 수칙을 다음과 같이 개편합니다.

1. 전문가 사칭, 허위 후기, 과도한 광고성 콘텐츠는 즉시 삭제 및 계정 제한
2. 신고 기능 고도화: 중복 신고가 일정 수치 이상 누적되면 자동으로 게시글이 숨겨집니다.
3. 신규 회원 웰컴 가이드를 추가해, 첫 방문 시 안전하게 커뮤니티를 익힐 수 있도록 했습니다.

자세한 내용은 공지 본문과 FAQ를 참고해 주세요.`,
    createdAt: '2025-10-10T09:00:00.000Z',
    category: 'announcement',
    featured: true,
  },
  {
    slug: 'november-care-event',
    title: '11월 홈케어 후기 이벤트',
    summary: '홈케어 루틴을 공유해 주시면 추첨을 통해 케어 키트를 드립니다. 11/30까지 참여 가능!',
    content: `11월 한 달 간 진행되는 홈케어 후기 이벤트 소식을 전해드립니다.

- 참여 방법: 홈케어 후기 게시판에 본인의 루틴/후기 작성 후 #홈케어챌린지 태그 추가
- 혜택: 추첨을 통해 30분께 두피 케어 키트를 증정
- 일정: 11/1 ~ 11/30, 당첨자는 12/5 공지로 안내

많은 참여 부탁드려요!`,
    createdAt: '2025-10-01T00:00:00.000Z',
    category: 'event',
  },
  {
    slug: 'service-maintenance-oct',
    title: '10월 25일 새벽 시스템 점검 안내',
    summary: '10월 25일(토) 02:00~05:00 사이 일부 기능 이용이 제한됩니다.',
    content: `안정적인 서비스 제공을 위한 시스템 점검이 예정되어 있습니다.

- 점검 일시: 10월 25일(토) 02:00 ~ 05:00
- 영향 범위: 로그인, 글 작성, 이미지 업로드 등 일부 기능 일시 중단

점검 시간은 최대한 단축될 수 있도록 노력하겠습니다. 이용에 불편을 드려 죄송합니다.`,
    createdAt: '2025-10-05T12:00:00.000Z',
    category: 'update',
  },
];

export function getNotices() {
  return notices.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getNoticeBySlug(slug: string) {
  return notices.find((notice) => notice.slug === slug);
}


