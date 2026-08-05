import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppProviders } from "@/app/providers";
import { router } from "@/app/router";
import "./styles.css";
import { registerServiceWorker } from "@/lib/register-service-worker";

const root = document.getElementById("root");
if (!root) throw new Error("Application root element is missing");

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" richColors closeButton />
    </AppProviders>
  </StrictMode>,
);

registerServiceWorker();
