import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../providers/theme-provider";
import { HomeScreen } from "../screens/HomeScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { Toaster } from "./components/ui/sonner";
import { useTodoStoreActions } from "../store/useTodoStore";

function App() {
  const { refreshTodoStatuses } = useTodoStoreActions();

  useEffect(() => {
    refreshTodoStatuses();
    const interval = window.setInterval(() => {
      refreshTodoStatuses();
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [refreshTodoStatuses]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
