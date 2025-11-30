
import { useState } from "react";
import { auth } from "/src/components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import { Lock, Mail, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/pricings");
    } catch {
      setError("❌ Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn"
        >
          <h2 className="text-center text-2xl font-bold text-orange-600 mb-6 flex items-center justify-center gap-2">
            <LogIn size={22} />
            Acesse sua conta
          </h2>

          {/* Email */}
          <div className="relative mb-4">
            <Mail
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
          </div>

          {/* Senha */}
          <div className="relative mb-4">
            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-3 animate-fadeIn">
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-600 text-white py-3 rounded-full font-semibold transition-all ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-orange-700 hover:scale-105"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* Info */}
          <p className="text-center text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} Inovale Jr.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}
