
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, ActivitySquare, PencilRuler } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadHandlerProps {
  iconType: "spiral" | "posture" | "generic";
  title: string;
  description: string;
  acceptTypes: string;
  onFileSelected: (file: File) => void;
  uploadProgress: number;
}

export const UploadHandler: React.FC<UploadHandlerProps> = ({
  iconType,
  title,
  description,
  acceptTypes,
  onFileSelected,
  uploadProgress
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };
  
  const getIcon = () => {
    switch (iconType) {
      case "spiral":
        return <PencilRuler className="h-10 w-10 text-gray-400 mb-2" />;
      case "posture":
        return <ActivitySquare className="h-10 w-10 text-gray-400 mb-2" />;
      default:
        return <Upload className="h-10 w-10 text-gray-400 mb-2" />;
    }
  };
  
  return (
    <>
      {uploadProgress > 0 && uploadProgress < 100 ? (
        <div className="w-full space-y-2 py-8">
          <p className="text-center text-sm text-gray-500 mb-2">Uploading file...</p>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          {getIcon()}
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <p className="text-xs text-gray-400 mb-4">{description}</p>
          <Button variant="default" onClick={handleClick} className="cursor-pointer">
            Choose File
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={acceptTypes}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </>
  );
};
