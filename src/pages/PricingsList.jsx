import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "/src/components/firebase";
import { signOut } from "firebase/auth";
import { Plus, LogOut, Users, Eye, FileDown, Trash2 } from "lucide-react";

export default function PricingsList() {
  const [pricings, setPricings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Carregar precificações
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pricings"));
        setPricings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erro ao buscar precificações:", err);
        alert("Erro ao carregar precificações.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Você saiu da sua conta!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  // 🔹 Excluir precificação selecionada
  const handleDelete = async () => {
    if (!selected) return alert("Selecione uma precificação primeiro.");
    if (!confirm("Tem certeza que deseja excluir esta precificação?")) return;

    try {
      await deleteDoc(doc(db, "pricings", selected));
      setPricings((prev) => prev.filter((p) => p.id !== selected));
      setSelected(null);
      alert("Precificação excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir precificação.");
    }
  };

  // 🔹 Ir para tela de revisão (visualizar)
  const handleView = () => {
    if (!selected) return;
    navigate(`/pricings/review/${selected}`);
  };

  // 🔹 Exportar PDF (aproveitando tela de revisão)
  const handleExport = () => {
    if (!selected) return;
    // você pode usar esse query param para dar auto-download no PricingReview se quiser
    navigate(`/pricings/review/${selected}?export=1`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        {/* 🎯 Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/60 flex items-center justify-center">
              <span className="text-cyan-300 font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Painel de Precificações
              </h1>
              <p className="text-sm text-slate-400">
                Visualize, exporte e gerencie as precificações da Avante Tech Jr.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-transform hover:-translate-y-0.5"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </header>

        {/* 🔧 Ações principais */}
        <section className="flex flex-wrap gap-3 justify-end mb-5">
          <button
            onClick={() => navigate("/clients")}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-transform hover:-translate-y-0.5"
          >
            <Users size={18} />
            <span>Ver clientes</span>
          </button>

          <button
            onClick={() => navigate("/clients/new")}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span>Nova precificação</span>
          </button>
        </section>

        {/* 📄 Lista de precificações */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-4 md:p-6">
          {loading ? (
            <p className="text-center text-slate-300 py-10 animate-pulse">
              Carregando precificações...
            </p>
          ) : pricings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-300 mb-2">
                Nenhuma precificação cadastrada ainda.
              </p>
              <p className="text-slate-500 text-sm">
                Clique em <span className="text-cyan-400">“Nova precificação”</span> para criar a primeira.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pricings.map((p) => {
                const isSelected = selected === p.id;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    className={`w-full text-left rounded-xl px-4 py-3 flex items-center justify-between gap-4 border transition-all ${
                      isSelected
                        ? "bg-slate-800/80 border-cyan-400 shadow-md"
                        : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-wide text-slate-400">
                          {p.codigo || "Sem código"}
                        </span>
                        {p.status && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {p.status}
                          </span>
                        )}
                      </div>

                      <p className="font-medium text-sm md:text-base text-slate-50 truncate">
                        {p.problem_description || "Sem descrição"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {p.equipment_name || "Projeto sem nome"} •{" "}
                        {p.total_cost
                          ? `Orçamento: R$ ${p.total_cost}`
                          : "Sem valor calculado"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isSelected ? "bg-cyan-400" : "bg-slate-600"
                        }`}
                      />
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                        className="accent-cyan-400"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 🔘 Ações secundárias */}
        <section className="flex flex-wrap gap-4 mt-8 justify-center">
          <button
            onClick={handleView}
            disabled={!selected}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-transform ${
              selected
                ? "bg-emerald-500 hover:bg-emerald-400 text-white hover:-translate-y-0.5"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Eye size={18} />
            <span>Visualizar</span>
          </button>

          <button
            onClick={handleExport}
            disabled={!selected}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-transform ${
              selected
                ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:-translate-y-0.5"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <FileDown size={18} />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={!selected}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-transform ${
              selected
                ? "bg-red-600 hover:bg-red-500 text-white hover:-translate-y-0.5"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Trash2 size={18} />
            <span>Excluir</span>
          </button>
        </section>

        {/* 🔹 Rodapé */}
        <footer className="mt-10 text-xs text-slate-500 text-center">
          Desenvolvido por{" "}
          <span className="text-cyan-400 font-medium">sasp_dev.</span>
        </footer>
      </div>
    </div>
  );
}
