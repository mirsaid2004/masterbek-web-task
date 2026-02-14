import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VideoCacheProvider } from "./context/VideoCacheContext";
import HeroPage from "./pages/HeroPage";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <VideoCacheProvider>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </VideoCacheProvider>
    </BrowserRouter>
  );
}

export default App;
