import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./views/HomePage";
import SurahDetailPage from "./views/SurahDetailPage";
import PageWrapper from "./components/PageWrapper";
import MediaPlayer from "./components/MediaPlayer";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/surah/:id"
          element={
            <PageWrapper>
              <SurahDetailPage />
            </PageWrapper>
          }
        />
      </Routes>
      <MediaPlayer />
    </BrowserRouter>
  );
};

export default App;
