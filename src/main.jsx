import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@material-tailwind/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Homepage from "./pages/HomePage.jsx";
import PdfViewerPage from "./pages/PdfViewerPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/pdf-viewer",
        element: <PdfViewerPage />,
      },
      {
        path: "/chatbot",
        element: <ChatbotPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
