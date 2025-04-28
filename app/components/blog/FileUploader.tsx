// components/FileUploader.tsx
"use client";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

// Import chunk plugin
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginFileChunking from "filepond-plugin-file-poster";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";

import { useState } from "react";

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFilePoster,
  FilePondPluginFileChunking
);

type FileUploaderProps = {
  serverUrl: string; // Where to send uploaded chunks
};

const FileUploader = ({ serverUrl }: FileUploaderProps) => {
  const [files, setFiles] = useState<any[]>([]);

  return (
    <div className="w-full p-2">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        maxFiles={1}
        chunkUploads
        chunkSize={500_000} // 500 KB per chunk (adjust as needed)
        chunkRetryDelays={[500, 1000, 3000]} // Retry upload if fails
        server={{
          url: serverUrl,
          process: "/process", // endpoint that handles chunks
          revert: "/revert", // endpoint that can cancel
        }}
        name="file"
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
};

export default FileUploader;
