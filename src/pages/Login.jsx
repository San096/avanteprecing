import { useState } from "react";
import { auth } from "/src/components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/pricings");
    } catch {
      setError("❌ Usuário ou senha inválidos");
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 relative z-10">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md mt-10"
        >
          <h2 className="text-center text-xl font-semibold mb-6">
            Faça seu login
          </h2>

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-full border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-full border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}