import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster } from "react-hot-toast";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

const AddFilesDialog = (props) => {
  const { onAfterUpload, isOpen, setIsOpen } = props;
  const [base64Files, setBase64Files] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setBase64Files([]);
    }
  };

  // Dropzone file handler
  const onDrop = (acceptedFiles) => {
    convertFilesToBase64(acceptedFiles);
  };

  const convertFilesToBase64 = (files) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result),
            contentType: file.type,
            fileSize: file.size,
          });
        reader.onerror = reject;
      });
    });

    Promise.all(promises).then((base64Files) => {
      setBase64Files(base64Files);
    });
  };

  const replaceBase64 = (base64) => {
    const newstr = base64.replace(/^data:[^;]+;base64,/, "");
    return newstr;
  };

  const onUpload = async () => {
    if (!uploading) {
      setUploading(true);
      const files = base64Files.map(async (file) => ({
        content: file.fileContent,
      }));
      //call upload api here
    }
  };

  // Dropzone settings
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf", ".htm"],
      "application/msword": [".doc", ".docx"],
    },
  });

  return (
    <div>
      <Toaster />
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={toggleModal}>
          <DialogContent className="rounded-2xl">
            <DialogHeader className="text-primary">Upload File</DialogHeader>

            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              className="rounded-2xl border-2 border-dashed border-muted-foreground bg-muted p-10 mt-5 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-[#04adef] hover:opacity-80 ho ">
                Drag & Drop files here, or click to select files
              </p>
            </div>

            {/* Uploaded Files (Base64) */}
            {base64Files.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-sm text-start text-primary">
                  Selected Files
                </h3>
                <ul className="list-disc list-inside text-start text-primary">
                  {base64Files.map((file, index) => (
                    <li key={index} className="break-words text-xs font-thin">
                      <strong>{file.fileName}:</strong>
                      {/* {file.base64} */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close button */}
            <div className="flex justify-center gap-1 mt-10">
              <Button size={"sm"} variant={"secondary"} onClick={toggleModal}>
                Close
              </Button>
              <Button
                size={"sm"}
                variant={"default"}
                className={` flex justify-between gap-1 items-center ${
                  uploading && "cursor-not-allowed opacity-70"
                }`}
                onClick={onUpload}
              >
                {uploading && (
                  <Loader2Icon
                    size={16}
                    className="text-black/90 animate-spin"
                  />
                )}
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default AddFilesDialog;
