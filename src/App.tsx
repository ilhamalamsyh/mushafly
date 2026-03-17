import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./views/HomePage";
import SurahDetailPage from "./views/SurahDetailPage";
import ImsakiyahPage from "./views/ImsakiyahPage";
import JadwalShalatPage from "./views/JadwalShalatPage";
import DoaListPage from "./views/DoaListPage";
import DoaDetailPage from "./views/DoaDetailPage";
import PageWrapper from "./components/PageWrapper";
import MediaPlayer from "./components/MediaPlayer";
import { ToastProvider } from "./components/ui/Toast";

const App = () => {
  return (
    <ToastProvider>
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
          <Route
            path="/doa"
            element={
              <PageWrapper>
                <DoaListPage />
              </PageWrapper>
            }
          />
          <Route
            path="/doa/:id"
            element={
              <PageWrapper>
                <DoaDetailPage />
              </PageWrapper>
            }
          />
        </Routes>
        <MediaPlayer />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
