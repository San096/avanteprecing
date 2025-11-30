import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";

export default function NewClient() {
  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    address: "",
    city_state: "",
    cep: "",
    phone: "",
    email: "",
  });

  const [clients, setClients] = useState([]);
  const [existingClientId, setExistingClientId] = useState("");
  const [error, setError] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // 🔹 Buscar clientes existentes para o select
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clients"));
        setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const docRef = await addDoc(collection(db, "clients"), form);
      alert("✅ Cliente cadastrado com sucesso!");
      navigate(`/pricings/new?clientId=${docRef.id}`);
    } catch (err) {
      console.error(err);
      setError("❌ Erro ao cadastrar cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleGoToPricing = () => {
    if (!existingClientId) {
      alert("Selecione um cliente existente!");
      return;
    }
    navigate(`/pricings/new?clientId=${existingClientId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100">
     

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-cyan-300">
              Cliente da Avante Tech Jr.
            </h2>
            <p className="text-sm text-slate-400">
              Selecione um cliente já cadastrado ou registre um novo para
              continuar a precificação.
            </p>
          </div>

          {/* 🔹 Cliente já cadastrado */}
          <section className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-lg font-medium text-cyan-300 mb-1">
              Já possui cadastro?
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mb-3">
              Escolha um cliente existente para ir direto para a criação da
              precificação.
            </p>

            {loadingClients ? (
              <p className="text-sm text-slate-300 animate-pulse">
                Carregando clientes...
              </p>
            ) : clients.length === 0 ? (
              <p className="text-sm text-slate-300">
                Ainda não há clientes cadastrados.
              </p>
            ) : (
              <>
                <select
                  value={existingClientId}
                  onChange={(e) => setExistingClientId(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.city_state ? `— ${c.city_state}` : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGoToPricing}
                  disabled={!existingClientId}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold shadow-md transition-transform ${
                    existingClientId
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:-translate-y-0.5"
                      : "bg-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Ir para precificação
                </button>
              </>
            )}
          </section>

          {/* divisor */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-700" />
            <span className="absolute bg-slate-900/80 px-3 text-[11px] text-slate-400 uppercase tracking-wide">
              ou cadastre um novo cliente
            </span>
          </div>

          {/* 🔹 Formulário novo cliente */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 text-sm"
          >
            <input
              type="text"
              name="name"
              placeholder="Nome da empresa"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <input
              type="text"
              name="cnpj"
              placeholder="CNPJ"
              value={form.cnpj}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Endereço"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                name="city_state"
                placeholder="Cidade/Estado"
                value={form.city_state}
                onChange={handleChange}
                className="flex-1 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={form.cep}
                onChange={handleChange}
                className="w-full md:w-40 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                name="phone"
                placeholder="Telefone"
                value={form.phone}
                onChange={handleChange}
                className="flex-1 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="flex-1 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center mt-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className={`w-full mt-1 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-transform ${
                saving
                  ? "bg-cyan-500/60 text-slate-900 cursor-not-allowed"
                  : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:-translate-y-0.5"
              }`}
            >
              {saving ? "Salvando..." : "Salvar novo cliente e ir para precificação"}
            </button>
          </form>

          {/* 🔹 Botão voltar */}
          <button
            type="button"
            onClick={() => navigate("/pricings")}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-md transition-transform hover:-translate-y-0.5"
          >
            Voltar para lista de precificações
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
