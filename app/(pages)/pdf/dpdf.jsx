'use client'
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Page, Document, PDFDownloadLink } from "@react-pdf/renderer";

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );



export default function App() {
    const supabase = createClient();
  const [user, setUser] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: user } = await supabase.auth.user();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user: ", error.message);
      }
    }

    fetchUser();
  }, []);

  const downloadPdf = async () => {
    try {
      const { data, error } = await supabase
        .from("appartement")
        .select("pdf_url")
        .eq("ide", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.pdf_url) {
        const { data: pdfData, error: pdfError } = await supabase
          .storage.from("avatars")
          .download(data.pdf_url);

        if (pdfError) {
          throw pdfError;
        }

        const pdfUrl = URL.createObjectURL(pdfData);
        setPdfUrl(pdfUrl);
      } else {
        console.warn("No PDF URL found in fetched data.");
        setPdfUrl(null);
      }
    } catch (error) {
      console.error("Error downloading PDF: ", error.message);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
        {pdfUrl ? (
          <div>
            <PDFViewer className="w-full h-64 mb-4">
              <Document file={pdfUrl}>
                <Page pageNumber={1} />
              </Document>
            </PDFViewer>
            <PDFDownloadLink
              document={<Document file={pdfUrl} />}
              fileName={`${profile.title || "document"}.pdf`}
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
          </div>
        ) : (
          <p>No PDF associated with your account. You can upload one if needed.</p>
        )}
      </div>
  );
}