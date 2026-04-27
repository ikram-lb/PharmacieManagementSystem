import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboardPage";
import MedicamentsPage from "@/pages/medicamentPage";
import MedicamentFormPage from "./components/medicaments/medicamentFormPage";
import { Toaster } from "sonner";
import { Sidebar } from "./components/common/Sidebar";
import VentesPage from "./pages/VentesPage";
import VenteFormPage from "./components/ventes/VenteFormPage";
import VenteDetailPage from "./components/ventes/VenteDetailPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CategoriesPage from "./pages/categoriePage";
import CategorieFormPage from "./components/categories/addCategoriesPage";
import Page from "./pages/LoginPage";
import { SidebarProvider } from "./components/ui/sidebar";
import CaissiersPage from "./pages/caissierPage";
import CaissierFormPage from "./components/Authentification/caissierFomPage";


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "0rem",
        } as React.CSSProperties
      }
      className="flex h-screen w-full overflow-hidden"
    >
      <Sidebar />
      {/*
        min-w-0 is critical here — without it, flex children don't shrink
        below their content size, so <main> can overflow and push content
        off-screen instead of staying within the remaining flex space.
      */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-muted/20">
        {children}
      </main>
    </SidebarProvider>
  );
}


export default function App() {
  return (
    
      <AuthProvider>
      <BrowserRouter>
       <Toaster richColors position="top-right" />

        <Routes>
          
          {/* Public route */}
          <Route path="/" element={<Page />} />

          {/* Protected routes — all roles */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Medicaments — both roles can view, Caissier blocked from add/edit by backend */}
          <Route
            path="/medicaments"
            element={
              <ProtectedRoute>
                <Layout>
                  <MedicamentsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/medicaments/new"
            element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout>
                  <MedicamentFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/medicaments/:id/edit"
            element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout>
                  <MedicamentFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ventes — both roles */}
          <Route
            path="/ventes"
            element={
              <ProtectedRoute>
                <Layout>
                  <VentesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventes/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <VenteFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventes/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <VenteDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Categories — DoctorAdmin only */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout>
                   <CategoriesPage />
                </Layout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/categories/:id/edit"
            element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout>
                  <CategorieFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories/new"
            element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout>
                   <CategorieFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Caissier management — DoctorAdmin only */}
          <Route path="/caissiers" element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout><CaissiersPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/caissiers/new" element={
              <ProtectedRoute role="DoctorAdmin">
                <Layout><CaissierFormPage /></Layout>
              </ProtectedRoute>
            } />


          <Route path="/caissiers/:id/edit" element={
            <ProtectedRoute role="DoctorAdmin">
              <Layout><CaissierFormPage /></Layout>
            </ProtectedRoute>
          } />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}