"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { createClient } from "@/utils/supabase/client";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = () => {
  const supabase = createClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrls, setPdfUrls] = useState([]); // Store multiple PDF URLs in an array
  const [user, setUser] = useState(null);
  const [pageWidth, setPageWidth] = useState(800); // Initial page width
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [ida, setIda] = useState(null); // Store selected PDF for modal

  // Memoize the options object to prevent unnecessary re-renders
  const options = React.useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "standard_fonts/",
    }),
    []
  );

  const wj = 300;
  const zl = 800;

  useEffect(() => {
    const fetchPdfUrls = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) throw new Error("User not authenticated");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("ida")
          .eq("id", user?.id)
          .single();

        if (profileError) throw profileError;

        setIda(profileData.ida);

        const { data, error } = await supabase
          .from("pdf")
          .select("pdf_url")
          .eq("ida", profileData.ida);

        if (error) {
          throw error;
        }

        // Extract PDF URLs from the fetched data
        const urls = data.map((item) => item.pdf_url);
        setPdfUrls(urls);
      } catch (error) {
        console.error("Error fetching PDF URLs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrls();
  }, [supabase]);

  function onPageLoadSuccess() {
    setLoading(false);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleOpenModal = (url) => {
    setSelectedPdf(url);
    onOpen();
  };

  return (
    <div className="px-24">
      <div className="flex flex-wrap gap-4 px-24 h-fit">
        {pdfUrls.map((url, index) => (
          <div key={index} className="border rounded-xl ">
            <Button onPress={() => handleOpenModal(url)} className="h-fit">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <Document
                  file={url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                >
                  <Page
                    pageNumber={pageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    onLoadSuccess={onPageLoadSuccess}
                    width={Math.max(300 * 0.8, wj)}
                  />
                </Document>
              )}
            </Button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        placement="top"
      >
        <ModalContent>
          <ModalBody>
            {selectedPdf && (
              <Document
                file={selectedPdf}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
              >
                <Page
                  pageNumber={pageNumber}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onLoadSuccess={onPageLoadSuccess}
                  width={Math.max(300 * 0.8, zl)}
                />
              </Document>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PDFViewer;
