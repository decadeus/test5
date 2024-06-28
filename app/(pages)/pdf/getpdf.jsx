"use client";
import React, { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; // Assuming you placed pdf.worker.js in your public folder

export default function PDFViewerr() {
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);


const widthq = "100";
  function onPageLoadSuccess() {

    setLoading(false);
  }
  const options = useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "standard_fonts/",
    }),
    []
  );
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  

  return (
    <div className=" flex flex-wrap w-full ">
     
      <div className="border w-1/4">
        <Document
          file="https://nyaqyzyhzazvjsjucgyf.supabase.co/storage/v1/object/public/avatars/b18d8a34-931e-4127-ae45-31b3d80b53a2-pdf-exempleA.pdf"
          options={options}
          renderMode="canvas"
          style={{ width: "800px", backgroundColor: '#E4E4E4', margin: 0,
            padding: 10, }}
        >
          <Page
           
            pageNumber={1} // Display the first and only page
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadSuccess={onPageLoadSuccess}
            onRenderError={() => setLoading(false)}
           
            style={{ width: "800px", backgroundColor: '#E4E4E4', margin: 0,
              padding: 10, }}
              size="A4"
          />
        </Document>
      </div>
    </div>
  );
}
