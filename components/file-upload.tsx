// "use client";
// import React, { useState } from "react";
// import { FileUpload } from "@/components/ui/file-upload";
// import { uploadImage } from "@/app/(admin)/patients/action";
// import { toast } from "./hooks/use-toast";

// export function FileUploadDemo({ patientId }) {
//   const [files, setFiles] = useState<File[]>([]);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleFileUpload = (files: File[]) => {
//     setFiles(files);
//   };

//   const handleSubmit = async () => {
//     if (files.length === 0) return;

//     try {
//       setIsUploading(true);

//       // Handle each file upload
//       const uploadPromises = files.map(async (file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         return await uploadImage(patientId, formData);
//       });

//       const results = await Promise.all(uploadPromises);
//       console.log("Upload results:", results);

//       // Clear files after successful upload
//       setFiles([]);
//       toast({
//         title: "You submitted the following values:",
//         description: (
//           <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//             <code className="text-white">
//               {JSON.stringify(FormData, null, 2)}
//             </code>
//           </pre>
//         ),
//       });
//     } catch (error) {
//       console.error("Upload failed:", error);
//       toast({
//         title: "You submitted the following values:",
//         description: (
//           <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//             <code className="text-white">failed</code>
//           </pre>
//         ),
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
//       <FileUpload onChange={handleFileUpload} />
//       <button
//         onClick={handleSubmit}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
//         disabled={files.length === 0 || isUploading}
//       >
//         {isUploading ? "Uploading..." : "Submit Files"}
//       </button>
//     </div>
//   );
// }
