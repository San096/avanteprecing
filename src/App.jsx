import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "/src/pages/Login";
import PricingsList from "/src/pages/PricingsList";
import NewClient from "/src/pages/NewClient";
import NewPricing from "./pages/NewPrecing"; // ✅ Corrigido aqui
import PricingReview from "/src/pages/PricingReview";
import ClientsList from "/src/pages/ClientsList"; // ✅ Import adicionado
import ProtectedRoute from "/src/components/protectdeRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota padrão redireciona para login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Lista de precificações */}
        <Route
          path="/pricings"
          element={
            <ProtectedRoute>
              <PricingsList />
            </ProtectedRoute>
          }
        />

        {/* Lista de clientes */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsList />
            </ProtectedRoute>
          }
        />

        {/* Novo cliente */}
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <NewClient />
            </ProtectedRoute>
          }
        />

        {/* Nova precificação */}
        <Route
          path="/pricings/new"
          element={
            <ProtectedRoute>
              <NewPricing />
            </ProtectedRoute>
          }
        />

        {/* Revisão de precificação */}
        <Route
          path="/pricings/review/:id"
          element={
            <ProtectedRoute>
              <PricingReview />
            </ProtectedRoute>
          }
        />

        {/* Fallback – redireciona qualquer rota inválida */}
        <Route path="*" element={<Navigate to="/pricings" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
