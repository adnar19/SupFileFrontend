import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/Login";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}