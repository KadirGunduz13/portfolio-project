import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AboutManager from './pages/admin/AboutManager';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectManager from './pages/admin/ProjectManager';
import EducationManager from './pages/admin/EducationManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import CertificationManager from './pages/admin/CertificationManager';
import AdminSkills from "./pages/admin/AdminSkills";
import AdminLanguages from "./pages/admin/AdminLanguages";

function App() {
    return (
        <Router>
            <Routes>
                {/* Herkese Açık Rota */}
                <Route path="/" element={<Home />} />

                {/* Login Rotası */}
                <Route path="/admin/login" element={<Login />} />

                {/* Korumalı Admin Rotaları (İç İçe Yapı) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="about" replace />} />
                    <Route path="about" element={<AboutManager />} />
                    <Route path="projects" element={<ProjectManager />} />
                    <Route path="educations" element={<EducationManager />} />
                    <Route path="experiences" element={<ExperienceManager />} />
                    <Route path="certificates" element={<CertificationManager/>} />
                    <Route path="skills" element={<AdminSkills />} />
                    <Route path="languages" element={<AdminLanguages />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;