import React from 'react';

function GoogleDrivePdfViewer({ pdfUrl }) {
  // Construct the Google Docs Viewer URL
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <iframe
      src={googleDocsViewerUrl}
      width="100%"
      height="500px"
      style={{ border: 'none' }}
      title="Google Drive PDF Viewer"
    ></iframe>
  );
}

export default GoogleDrivePdfViewer;