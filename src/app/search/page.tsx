// src/app/search/page.tsx
import Hero from "@/components/ui/Hero";
import SearchContainer from "@/components/containers/SearchContainer";

export default function SearchPage() {
  return (
    <>
      <Hero 
        title="게시글 검색"
        subtitle="제목, 내용, 태그에서 원하는 정보를 찾아보세요."
      />
      <div style={{ marginTop: 12 }}>
        <SearchContainer />
      </div>
    </>
  );
}
