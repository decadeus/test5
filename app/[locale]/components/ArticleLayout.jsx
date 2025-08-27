"use client";
import { useEffect } from "react";
import { FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";
import BackToBlog from "./BackToBlog";
import "../blog/article-styles.css";

export default function ArticleLayout({ 
  title, 
  author, 
  date, 
  readTime, 
  imageUrl, 
  imageAlt,
  jsonLd,
  children 
}) {
  useEffect(() => {
    // Ajouter les données structurées JSON-LD
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [jsonLd]);

  return (
    <div className="article-container">
      <div className="article-content">
        <BackToBlog />
        
        <div className="article-header">
          <h1 className="article-title">
            {title}
          </h1>
          
          <div className="article-meta">
            <div className="article-meta-item">
              <FaUser className="text-blue-600" />
              <span>{author}</span>
            </div>
            <div className="article-meta-item">
              <FaCalendarAlt className="text-blue-600" />
              <span>{new Date(date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="article-meta-item">
              <FaClock className="text-blue-600" />
              <span>{readTime}</span>
            </div>
          </div>
          
          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="article-image"
            />
          )}
        </div>

        <div className="article-body">
          {children}
        </div>
      </div>
    </div>
  );
}
