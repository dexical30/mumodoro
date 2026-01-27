import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../providers/theme-provider";
import { HomeScreen } from "../screens/HomeScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { Toaster } from "./components/ui/sonner";

function App() {
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
