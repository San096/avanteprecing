import { useState } from "react";
import { auth } from "/src/components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import { Lock, Mail, LogIn } from "lucide-react";

const floatingStars = [
  { left: "8%", bottom: "-10%", duration: 32, delay: 0 },
  { left: "22%", bottom: "-12%", duration: 26, delay: 5 },
  { left: "40%", bottom: "-15%", duration: 30, delay: 10 },
  { left: "60%", bottom: "-18%", duration: 34, delay: 2 },
  { left: "78%", bottom: "-16%", duration: 28, delay: 8 },
  { left: "90%", bottom: "-20%", duration: 36, delay: 14 },
];

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
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden">
      {/* 🔹 Fundo com gradiente + estrelas flutuando */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#001426] to-[#000814]" />

        {/* Estrelas flutuando (usam a classe .star-floating do CSS) */}
        {floatingStars.map((star, index) => (
          <span
            key={index}
            className="star-floating"
            style={{
              left: star.left,
              bottom: star.bottom,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Header permanece igual */}
      <Header />

      {/* Conteúdo do login (fica acima das estrelas) */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
        <form
          onSubmit={handleLogin}
          className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full max-w-md px-6 py-8 md:px-8 animate-fadeIn"
        >
          <h2 className="text-center text-2xl md:text-3xl font-bold text-cyan-400 mb-6 flex items-center justify-center gap-2 drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]">
            <LogIn size={22} />
            <span>Entrar no painel</span>
          </h2>

          {/* Email */}
          <div className="relative mb-4">
            <Mail
              size={18}
              className="absolute left-3 top-3.5 text-cyan-300/80"
            />
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-full bg-slate-950/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              required
            />
          </div>

          {/* Senha */}
          <div className="relative mb-4">
            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-cyan-300/80"
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-full bg-slate-950/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              required
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-3 animate-fadeIn">
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-cyan-500 text-slate-950 py-3 rounded-full font-semibold transition-all shadow-lg shadow-cyan-500/30 ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-cyan-400 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-xs md:text-sm text-slate-400 mt-4">
            © {new Date().getFullYear()} AvanteTech Jr.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}
