import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./views/HomePage";
import SurahDetailPage from "./views/SurahDetailPage";
import ImsakiyahPage from "./views/ImsakiyahPage";
import JadwalShalatPage from "./views/JadwalShalatPage";
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
        <Route
          path="/imsakiyah"
          element={
            <PageWrapper>
              <ImsakiyahPage />
            </PageWrapper>
          }
        />
        <Route
          path="/shalat"
          element={
            <PageWrapper>
              <JadwalShalatPage />
            </PageWrapper>
          }
        />
      </Routes>
      <MediaPlayer />
    </BrowserRouter>
  );
};

export default App;
