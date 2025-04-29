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

const FileUploader = () => {
  const [files, setFiles] = useState<any[]>([]);

  return (
    <div className="w-full p-2">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        maxFiles={1}
        chunkUploads
        // chunkSize={80 * 1024 * 1024} // 80 MB
        chunkSize={500_000}
        chunkRetryDelays={[500, 1000, 3000]}
        server={{
          url: "/api/upload",
          process: {
            url: "/process",
            method: "POST",
            withCredentials: true,

            ondata: (formData) => {
              const file = files[0]?.file;
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
          },
          revert: "/revert",
        }}
        name="file"
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
};

export default FileUploader;
