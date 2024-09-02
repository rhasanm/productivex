import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import router from "@/router";
import "@/index.css";
// import TitleBar from "./components/custom/titlebar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <TitleBar /> */}
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
