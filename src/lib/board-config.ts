export type BoardFetchStrategy = {
  label: string;
  aliases?: string[];
  aliasLabels?: Record<string, string>;
  categoryEnvKey?: string;
  categoryName?: string;
  fallbackType?: 'expert_qna' | 'product' | 'hospital';
  enableCategoryNameApiFallback?: boolean;
};

export const BOARD_CONFIG = {
  qna: {
    label: 'Q&A',
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_QNA',
    categoryName: 'Q&A',
    fallbackType: 'expert_qna',
  },
  'product-reviews': {
    label: '제품리뷰',
    aliases: ['product'],
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_PRODUCT_REVIEWS',
    categoryName: '제품리뷰',
    fallbackType: 'product',
  },
  'useful-info': {
    label: '유용 정보',
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_USEFUL_INFO',
    categoryName: '유용 정보',
    enableCategoryNameApiFallback: true,
  },
  'hospital-reviews': {
    label: '병원 후기',
    aliases: ['clinics'],
    aliasLabels: { clinics: '지역 병원/클리닉' },
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_HOSPITAL_REVIEWS',
    categoryName: '병원후기',
    fallbackType: 'hospital',
  },
  'manage-reviews': {
    label: '관리후기',
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_MANAGE_REVIEWS',
    categoryName: '관리후기',
    enableCategoryNameApiFallback: true,
  },
  'procedure-reviews': {
    label: '시술후기',
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_PROCEDURE_REVIEWS',
    categoryName: '시술후기',
    enableCategoryNameApiFallback: true,
  },
  'research-news': {
    label: '연구 및 뉴스',
    categoryEnvKey: 'NEXT_PUBLIC_CATEGORY_ID_RESEARCH_NEWS',
    categoryName: '연구 및 뉴스',
    enableCategoryNameApiFallback: true,
  },
} satisfies Record<string, BoardFetchStrategy>;

type BoardSlug = keyof typeof BOARD_CONFIG;

const BOARD_ENTRIES = Object.entries(BOARD_CONFIG) as Array<
  [BoardSlug, BoardFetchStrategy]
>;

const ALIAS_TO_SLUG = BOARD_ENTRIES.reduce(
  (acc, [slug, config]) => {
    config.aliases?.forEach((alias) => {
      acc[alias] = slug;
    });
    return acc;
  },
  {} as Record<string, BoardSlug>
);

export function resolveBoardSlug(slug: string): BoardSlug | undefined {
  if (slug in BOARD_CONFIG) return slug as BoardSlug;
  return ALIAS_TO_SLUG[slug];
}

const LEGACY_BOARD_LABEL: Record<string, string> = {
  talk: 'Q&A',
  treatment: '치료/약 정보',
  reviews: '관리후기/제품리뷰',
};

export const BOARD_LABEL = BOARD_ENTRIES.reduce(
  (acc, [slug, config]) => {
    acc[slug] = config.label;
    config.aliases?.forEach((alias) => {
      acc[alias] = config.aliasLabels?.[alias] ?? config.label;
    });
    return acc;
  },
  { ...LEGACY_BOARD_LABEL } as Record<string, string>
);

export function getBoardLabel(slug: string): string | undefined {
  return BOARD_LABEL[slug];
}

export function getBoardConfig(slug: string) {
  const canonical = resolveBoardSlug(slug);
  if (!canonical) return undefined;
  return {
    slug: canonical,
    config: BOARD_CONFIG[canonical],
  };
}


