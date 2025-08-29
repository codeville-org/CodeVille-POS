import { AlertCircle, Check, Upload, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

type Props = {
  onUploaded: (filename: string) => void;
};

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadState {
  status: UploadStatus;
  progress: number;
  error?: string;
  preview?: string;
  filename?: string;
}

export function ImageUploader({ onUploaded }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Please upload JPG, PNG, or WebP images only.";
    }

    if (file.size > maxSize) {
      return "File size too large. Please upload images smaller than 10MB.";
    }

    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState({
          status: "error",
          progress: 0,
          error: validationError
        });
        return;
      }

      setUploadState({
        status: "uploading",
        progress: 0,
        error: undefined
      });

      try {
        // Create preview
        const preview = URL.createObjectURL(file);
        setUploadState((prev) => ({ ...prev, preview }));

        // Simulate upload progress
        for (let i = 0; i <= 90; i += 10) {
          setUploadState((prev) => ({ ...prev, progress: i }));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        setUploadState((prev) => ({ ...prev, progress: 95 }));

        // Here you would call your ImageManager
        // const filename = await imageManager.saveImageFromBase64(base64);

        // For demo purposes, we'll simulate this
        const filename = `${Date.now()}-${file.name}`;

        setUploadState((prev) => ({ ...prev, progress: 100 }));

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 200));

        setUploadState({
          status: "success",
          progress: 100,
          preview,
          filename
        });

        onUploaded(filename);
      } catch (error) {
        setUploadState({
          status: "error",
          progress: 0,
          error:
            error instanceof Error ? error.message : "Failed to upload image"
        });
      }
    },
    [onUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleClick = useCallback(() => {
    if (uploadState.status === "uploading") return;
    fileInputRef.current?.click();
  }, [uploadState.status]);

  const resetUpload = useCallback(() => {
    if (uploadState.preview) {
      URL.revokeObjectURL(uploadState.preview);
    }
    setUploadState({
      status: "idle",
      progress: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadState.preview]);

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case "uploading":
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        );
      case "success":
        return (
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        );
      case "error":
        return (
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        );
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  };

  const getMainContent = () => {
    if (
      uploadState.preview &&
      (uploadState.status === "success" || uploadState.status === "uploading")
    ) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={uploadState.preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg shadow-md"
            />
            {uploadState.status === "uploading" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-white text-sm font-medium">
                  {uploadState.progress}%
                </div>
              </div>
            )}
          </div>
          {uploadState.status === "uploading" && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadState.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          )}
          {uploadState.status === "success" && uploadState.filename && (
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">
                Upload successful!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {uploadState.filename}
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-4">
        {getStatusIcon()}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {uploadState.status === "error" ? "Upload Failed" : "Upload Image"}
          </p>
          {uploadState.status === "error" && uploadState.error ? (
            <p className="text-sm text-red-500 mt-2">{uploadState.error}</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop an image here, or click to select
            </p>
          )}
        </div>
        {uploadState.status === "idle" && (
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>JPG, PNG, WebP</span>
            <span>•</span>
            <span>Max 10MB</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : uploadState.status === "error"
                ? "border-red-300 bg-red-50"
                : uploadState.status === "success"
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }
          ${uploadState.status === "uploading" ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {getMainContent()}

        {/* Reset button for success/error states */}
        {(uploadState.status === "success" ||
          uploadState.status === "error") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetUpload();
            }}
            className="absolute top-3 right-3 p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Upload another image"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
              Drop image here
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        disabled={uploadState.status === "uploading"}
      />

      {/* Upload stats */}
      {uploadState.status === "success" && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">
              Image uploaded successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
