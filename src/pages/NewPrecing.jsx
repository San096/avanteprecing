import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import { Home } from "lucide-react";

export default function NewPricing() {
  // 🔹 Dados fixos da empresa (mantidos)
  const companyData = {
    name: "AvanteTech Jr.",
    cnpj: "55.625.728/0001-09",
    address:
      "Avenida Jose de Freitas Queiroz, 5003 - Cedro - Quixadá/CE - CEP 63.902-580",
    phone: "(88) 9618-8715",
    email: "avantetechjr@gmail.com",
  };

  const [clients, setClients] = useState([]);
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");
  const [loading, setLoading] = useState(false);

  // 🔹 Form (lógica original mantida)
  const [form, setForm] = useState({
    clientId: clientIdFromUrl || "",
    problem_description: "",
    equipment_name: "",
    brand: "",
    model: "",
    devs: 1,
    business_days: 1,
    hours_per_day: 1,
    hourly_rate: 0,
  });

  // 🔹 Procedimentos (lógica original mantida)
  const [procedures, setProcedures] = useState([{ description: "", days: 0 }]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
  }, []);

  // 🧩 Função principal de envio (MANTIDA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");

      const q = query(
        collection(db, "pricings"),
        where("created_at", ">=", new Date(year, now.getMonth(), 1)),
        where("created_at", "<=", new Date(year, now.getMonth() + 1, 0))
      );
      const snapshot = await getDocs(q);
      const sequence = String(snapshot.size + 1).padStart(3, "0");

      // 👉 continua Avante- (como você já tinha)
      const codigo = `Avante-${year}.${month}.${sequence}`;

      const total_hours =
        form.business_days * form.hours_per_day * form.devs;
      const total_cost = total_hours * form.hourly_rate;

      const docRef = await addDoc(collection(db, "pricings"), {
        ...form,
        codigo,
        total_hours,
        total_cost,
        status: "draft",
        created_at: new Date(),
        companyData,
        procedures: procedures.filter((p) => p.description.trim() !== ""),
      });

      alert(`✅ Precificação criada com sucesso! TAG: ${codigo}`);
      navigate(`/pricings/review/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("❌ Ocorreu um erro ao salvar a precificação.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os procedimentos (mesma lógica)
  const handleProcedureChange = (index, field, value) => {
    const updated = [...procedures];
    updated[index][field] = value;
    setProcedures(updated);
  };

  const addProcedure = () => {
    setProcedures([...procedures, { description: "", days: 0 }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100">
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-4"
        >
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-cyan-300 mb-2">
            Nova Precificação — AvanteTech Jr.
          </h2>

          {/* 🔹 Dados da empresa */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs md:text-sm space-y-1">
            <p className="font-semibold text-cyan-300">{companyData.name}</p>
            <p>CNPJ: {companyData.cnpj}</p>
            <p>{companyData.address}</p>
            <p>
              {companyData.phone} · {companyData.email}
            </p>
          </div>

          {/* 🔹 Cliente */}
          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm font-medium">
              Cliente <span className="text-red-400">*</span>
            </label>
            <select
              className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              required
            >
              <option value="">Selecione o cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Descrição do problema (textarea para quebra de linha) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm font-medium">
              Descrição do problema
            </label>
            <textarea
              rows={3}
              value={form.problem_description}
              onChange={(e) =>
                setForm({ ...form, problem_description: e.target.value })
              }
              className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y"
              placeholder="Descreva o contexto, dores do cliente, objetivos do projeto..."
            />
          </div>

          {/* 🔹 Informações do equipamento / serviço */}
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Serviço prestado"
              value={form.equipment_name}
              onChange={(e) =>
                setForm({ ...form, equipment_name: e.target.value })
              }
              className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              placeholder="Marca"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              placeholder="Modelo"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* 🔹 Procedimentos (textarea para quebra de linha) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm font-medium">
              Procedimentos & Cronograma
            </label>
            {procedures.map((p, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-2 items-start"
              >
                <textarea
                  placeholder="Nome / descrição do procedimento"
                  value={p.description}
                  onChange={(e) =>
                    handleProcedureChange(index, "description", e.target.value)
                  }
                  rows={2}
                  className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y"
                />
                <div className="w-full md:w-24">
                  <label className="text-[11px] font-medium block mb-1">
                    Dias
                  </label>
                  <input
                    type="number"
                    placeholder="Dias"
                    value={p.days}
                    onChange={(e) =>
                      handleProcedureChange(
                        index,
                        "days",
                        Number(e.target.value)
                      )
                    }
                    className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProcedure}
              className="mt-1 self-start bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-600 text-slate-100 transition"
            >
              + Adicionar procedimento
            </button>
          </div>

          {/* 🔹 Equipe e horas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-medium">Devs</label>
              <input
                type="number"
                value={form.devs}
                onChange={(e) =>
                  setForm({ ...form, devs: Number(e.target.value) })
                }
                className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-medium">
                Dias úteis
              </label>
              <input
                type="number"
                value={form.business_days}
                onChange={(e) =>
                  setForm({
                    ...form,
                    business_days: Number(e.target.value),
                  })
                }
                className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-medium">
                Horas/dia
              </label>
              <input
                type="number"
                value={form.hours_per_day}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hours_per_day: Number(e.target.value),
                  })
                }
                className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* 🔹 Valor por hora */}
          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm font-medium">
              Valor da hora (R$)
            </label>
            <input
              type="number"
              value={form.hourly_rate}
              onChange={(e) =>
                setForm({ ...form, hourly_rate: Number(e.target.value) })
              }
              className="border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* 🔹 Botão principal */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-3 rounded-lg font-semibold text-sm shadow-md transition-transform ${
              loading
                ? "bg-cyan-500/60 text-slate-900 cursor-not-allowed"
                : "bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Salvando..." : "Salvar precificação"}
          </button>
        </form>
      </main>

      {/* 🔹 Botão flutuante — Voltar para Lista de Preços */}
      <button
        onClick={() => navigate("/pricings")}
        className="fixed bottom-6 left-6 bg-cyan-500 text-slate-950 p-4 rounded-full shadow-lg 
                   hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all duration-200 ease-out"
        title="Voltar para lista de precificações"
      >
        <Home size={26} />
      </button>

      <Footer />
    </div>
  );
}
