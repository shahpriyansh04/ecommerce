"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { uploadFiles } from "@xixixao/uploadstuff";
import { useMutation } from "convex/react";

import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../../../../../convex/_generated/api";

interface FileUploadProgress {
  progress: number;
  File: File;
}

enum FileTypes {
  Image = "image",
}

const ImageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

export default function FileUpload({
  setMedia,
}: Readonly<{
  setMedia: (media: string[]) => void;
}>) {
  const [uploadedFiles, setUploadedFiles] = useState<
    { progress: number; File: File }[]
  >([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  console.log(filesToUpload);

  const getFileIconAndColor = (file: File) => {
    return {
      icon: (
        <img src={URL.createObjectURL(file)} alt="" className="w-10 h-10" />
      ),
      color: ImageColor.bgColor,
    };
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.File !== file);
    });

    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter((item) => item.File !== file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFilesToUpload((prevUploadProgress) => {
      return [
        ...prevUploadProgress,
        ...acceptedFiles.map((file) => {
          return {
            progress: 0,
            File: file,
            source: null,
          };
        }),
      ];
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [uploadProgress, setUploadProgress] = useState({});
  const uploadFile = async () => {
    // Generate a URL for each file
    const urls = await Promise.all(
      filesToUpload.map(async (file) => {
        const url = await generateUploadUrl();
        console.log(url);

        return url;
      })
    );

    const uploadPromises = urls.map((url, index) => {
      return uploadFiles({
        files: [filesToUpload[index].File],
        url,
        onUploadProgress: ({ progress }) => {
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [filesToUpload[index].File.name]: progress,
          }));
          setUploadedFiles((prevUploadedFiles) => {
            return [...prevUploadedFiles, ...filesToUpload];
          });
        },
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const imageIds = uploadResults.flatMap((result) =>
      //@ts-ignore
      result.map((r) => r.response.storageId)
    );

    setMedia(imageIds);
    setUploadProgress({});

    const successfulUploads = await Promise.allSettled(uploadPromises);
    setFilesToUpload(
      filesToUpload.filter(
        (_, index) => successfulUploads[index].status !== "fulfilled"
      )
    );
  };
  console.log(uploadedFiles);

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
        >
          <div className=" text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Drag files</span>
            </p>
            <p className="text-xs text-gray-500">
              Click to upload files &#40;files should be under 10 MB &#41;
            </p>
          </div>
        </label>

        <input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/*"
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length > 0 && (
        <div className="w-full">
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Selected Images
          </p>
          <ScrollArea className="w-84">
            <div className=" gap-2 flex pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
                    key={fileUploadProgress.File.lastModified}
                    className="flex flex-col"
                  >
                    <div className="flex flex-col items-center py-2">
                      <div className="text-white relative">
                        <div className="w-40 h-40">
                          <img
                            src={URL.createObjectURL(fileUploadProgress.File)}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <X
                          onClick={() => removeFile(fileUploadProgress.File)}
                          className="w-5 h-5  p-1 bg-red-500 rounded-full  absolute -top-2 -right-2"
                        />
                      </div>
                      <Progress
                        //@ts-ignore
                        value={uploadProgress[fileUploadProgress.File.name]}
                        className="mt-4 w-40 h-2"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Uploaded Files
          </p>
          <div className=" flex gap-3">
            {uploadedFiles.map((file) => {
              return (
                <div
                  key={file?.File?.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group  hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center flex-1 p-2">
                    <div className="text-white relative">
                      <img
                        src={URL.createObjectURL(file.File)}
                        alt=""
                        className="w-10 h-10"
                      />
                      {/* <X
                        onClick={() => removeFile(file.File)}
                        className="w-2 h-2 text-black absolute top-0 right-0"
                      /> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Button
        onClick={uploadFile}
        className="w-full mt-4"
        variant={"secondary"}
      >
        Upload
      </Button>
    </div>
  );
}
