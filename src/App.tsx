
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Resources from "./pages/Resources";
import Training from "./pages/Training";
import NotFound from "./pages/NotFound";
import { AssessmentProvider } from "./context/AssessmentContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AssessmentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/training" element={<Training />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AssessmentProvider>
  </QueryClientProvider>
);

export default App;
