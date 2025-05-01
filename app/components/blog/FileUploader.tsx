"use client";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";

import { FC, useState } from "react";

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
);

const FileUploader: FC<{
  onUploadSuccess: (url: string, file: File) => void;
  onRevert: () => void;
}> = ({ onUploadSuccess, onRevert }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full p-2">
      <FilePond
        files={files}
        onupdatefiles={(fileItems) => {
          setFiles(fileItems.map((item) => item.file as File));
          console.log("upading files");
        }}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={["image/*"]}
        chunkUploads
        chunkSize={500_000} // 500 KB for each chunk (adjust as needed)
        chunkRetryDelays={[500, 1000, 3000]}
        server={{
          url: "/api/upload",
          process: {
            url: "/process",
            method: "POST",
            withCredentials: true,

            ondata: (formData) => {
              const file = files[0];
              if (file) {
                formData.append(
                  "metadata",
                  JSON.stringify({
                    name: file.name,
                    type: file.type,
                  })
                );
              }
              return formData;
            },
            onload: (response) => {
              const responseText =
                response instanceof XMLHttpRequest
                  ? response.responseText
                  : response;
              const file = files[0];
              if (file) {
                onUploadSuccess(responseText, file as File);
              }
              return responseText;
            },
          },
          restore: "/restore",
          load: "/load",
          fetch: "/fetch",
          revert: "/revert",
        }}
        onremovefile={() => {
          onRevert();
        }}
        name="file"
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
};

export default FileUploader;
