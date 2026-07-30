import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home page of rentra</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;