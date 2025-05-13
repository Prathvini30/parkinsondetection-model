
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ActivitySquare, PencilRuler, Loader2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAssessment } from "@/context/AssessmentContext";

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
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const { enhancedAnalysis } = useAssessment();
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Check file type
    const fileType = file.type.split('/')[0];
    
    if (iconType === "spiral" && fileType !== "image") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file for spiral analysis.",
      });
      return;
    }
    
    if (iconType === "posture" && fileType !== "image") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file for posture analysis.",
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
      });
      return;
    }
    
    // Process the file
    onFileSelected(file);
    
    // Show toast for real-time processing
    toast({
      title: "Real-time Processing",
      description: enhancedAnalysis 
        ? "Using high-accuracy models (>90% accuracy) for analysis."
        : "Using standard models for analysis.",
    });
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
          <p className="text-center text-sm text-gray-500 mb-2">
            {uploadProgress < 50 ? "Uploading file..." : "Processing with ML models..."}
          </p>
          <Progress value={uploadProgress} className="w-full" />
          {uploadProgress >= 50 && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-blue-600">
              <Info className="h-3 w-3" />
              <span>Using {enhancedAnalysis ? "high-accuracy" : "standard"} ML model</span>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 ${
            dragActive ? "border-parkinsons-500 bg-parkinsons-50" : "border-gray-300 bg-gray-50"
          } transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {getIcon()}
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <p className="text-xs text-gray-400 mb-4">{description}</p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Button variant="default" onClick={handleClick} className="cursor-pointer w-full">
              Choose File
            </Button>
            <p className="text-center text-xs text-gray-400">or drop files here</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={acceptTypes}
            className="hidden"
            onChange={handleFileChange}
          />
          {enhancedAnalysis && (
            <div className="mt-4 flex items-center text-xs gap-1.5 text-parkinsons-600 bg-parkinsons-50 px-2 py-1 rounded-md">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>High-accuracy ML models ready (>90% accuracy)</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
