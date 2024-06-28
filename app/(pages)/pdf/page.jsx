// "use client";
// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { createClient } from "@/utils/supabase/client";
// import {
//   Modal,
//   ModalContent,
//   ModalBody,
//   Button,
//   useDisclosure,
// } from "@nextui-org/react";


// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const PDFViewer = () => {
//   const supabase = createClient();
//   const [loading, setLoading] = useState(true);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [user, setUser] = useState(null);
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const [pageWidth, setPageWidth] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         setUser(user);

//         if (!user) throw new Error("User not authenticated");

//         const { data, error } = await supabase
//       .from("pdf")
//       .select("pdf_url, ide")
//       .eq("id", 1)
     
      
//       .single();

//         if (error) {
//           throw error;
//         }

//         setPdfUrl(data.pdf_url);
//       } catch (error) {
//         console.error("Error fetching PDF URL:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [supabase]);

//   const wj = 300;
//   const wb = 800;

//   function onPageLoadSuccess() {
//     setPageWidth(800);
//     setLoading(false);
//   }

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   const options = {
//     cMapUrl: "cmaps/",
//     cMapPacked: true,
//     standardFontDataUrl: "standard_fonts/",
//   };

//   return (
//     <>
//       <Button onPress={onOpen} className="h-fit">
//         <div className="flex flex-wrap gap-4 w-fit">
//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <div className="border">
//               <Document
//                 file={`https://nyaqyzyhzazvjsjucgyf.supabase.co/storage/v1/object/public/avatars/${pdfUrl}`}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 options={options}
//                 className=""
//               >
//                 <Page
//                   pageNumber={pageNumber}
//                   renderAnnotationLayer={false}
//                   renderTextLayer={false}
//                   onLoadSuccess={onPageLoadSuccess}
//                   onRenderError={() => setLoading(false)}
//                   width={Math.max(300 * 0.8, wj)}
//                 />
//               </Document>
//             </div>
//           )}
//         </div>
//       </Button>
//       <Modal
//         isOpen={isOpen}
//         onOpenChange={onOpenChange}
//         size="4xl"
//         placement="top"
//       >
//         <ModalContent>
//           <ModalBody>
//             <Document
//               file={`https://nyaqyzyhzazvjsjucgyf.supabase.co/storage/v1/object/public/avatars/${pdfUrl}`}
//               onLoadSuccess={onDocumentLoadSuccess}
//               options={options}
//               className=""
//             >
//               <Page
//                 pageNumber={pageNumber}
//                 renderAnnotationLayer={false}
//                 renderTextLayer={false}
//                 onLoadSuccess={onPageLoadSuccess}
//                 onRenderError={() => setLoading(false)}
//                 width={Math.max(300 * 0.8, wb)}
//               />
//             </Document>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default PDFViewer;