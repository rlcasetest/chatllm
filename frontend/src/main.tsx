import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./routes/login";
import { ChatPage } from "./routes/chat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { SessionProvider } from "./hooks/auth/useSession";
import { RegisterPage } from "./routes/register";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <div className="bg-background">
            <div className="hidden md:block">
              <Routes>
                <Route index element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="chat" element={<ChatPage />} />
              </Routes>

              <Toaster richColors theme="light" />
            </div>

            <div className="flex justify-center items-center h-dvh md:hidden">
              <p className="text-lg font-bold">
                Este sistema apenas funciona em desktop.
              </p>
            </div>
          </div>
        </QueryClientProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
);
