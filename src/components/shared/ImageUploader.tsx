// src/components/shared/ImageUploader.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const S3_BASE = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL;
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;
  const [resolvedUrls, setResolvedUrls] = useState<string[]>([]);

  const buildPublicUrl = (key: string) => {
    if (S3_BASE) {
      return `${S3_BASE.replace(/\/$/, "")}/${key}`;
    }
    if (S3_BUCKET && AWS_REGION) {
      return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    }
    // 최후의 수단: 키를 그대로 반환(상대경로 문제 유발 가능)
    return key;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        setUploadError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      setUploading(true);
      setUploadError("");

      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300"}/api/files/upload-multiple`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "이미지 업로드에 실패했습니다.");
        }

        const result = await response.json();
        const keys: string[] = result.data.urls;

        // 저장은 항상 "키"로만 한다 (만료 URL 저장 방지)
        onImagesChange([...images, ...keys]);
      } catch (error: any) {
        console.error("이미지 업로드 에러:", error);
        setUploadError(error.message || "이미지 업로드에 실패했습니다.");
      } finally {
        setUploading(false);
      }
    },
    [images, onImagesChange, maxImages]
  );

  // 미리보기용 표시 URL 계산 (키 또는 기존 http URL -> 표시 URL)
  // 퍼블릭 S3/CloudFront 전제: 항상 퍼블릭 베이스를 사용해 URL 생성
  useEffect(() => {
    let alive = true;
    (async () => {
      const list = (images || []).map((item) => (
        /^https?:\/\//i.test(item) ? item : buildPublicUrl(item)
      ));
      if (alive) setResolvedUrls(list);
    })();
    return () => {
      alive = false;
    };
  }, [images, S3_BASE, S3_BUCKET, AWS_REGION]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border-light dark:border-border-dark hover:border-primary hover:bg-primary/5"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            {uploading ? (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                업로드 중...
              </p>
            ) : isDragActive ? (
              <p className="text-sm text-primary font-semibold">
                여기에 이미지를 놓으세요
              </p>
            ) : (
              <>
                <p className="text-sm text-text-light dark:text-text-dark font-semibold">
                  클릭하거나 이미지를 드래그하여 업로드
                </p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  JPEG, PNG, GIF, WebP (최대 10MB, {maxImages}개까지)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {uploadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
          {uploadError}
        </div>
      )}

      {/* 업로드된 이미지 미리보기 */}
      {resolvedUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {resolvedUrls.map((imageUrl, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-border-light dark:border-border-dark group"
            >
              <img
                src={imageUrl}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`이미지 ${index + 1} 제거`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 이미지 개수 표시 */}
      {images.length > 0 && (
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
          {images.length}/{maxImages}개 이미지 업로드됨
        </p>
      )}
    </div>
  );
}
