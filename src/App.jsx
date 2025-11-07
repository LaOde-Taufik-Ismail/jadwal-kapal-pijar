import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import JadwalPelabuhanPage from "./pages/JadwalPelabuhanPage.jsx";
import JadwalPulauPage from "./pages/JadwalPulauPage.jsx";

const NAMA_REPO = "jadwal-kapal-pijar";

// Mendefinisikan URL mana yang akan menampilkan halaman mana.
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/pelabuhan/:pelabuhanId",
      element: <JadwalPelabuhanPage />,
    },
    {
      path: "/pulau/:pulauId",
      element: <JadwalPulauPage />,
    },
  ],
  { basename: `/${NAMA_REPO}/` }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
