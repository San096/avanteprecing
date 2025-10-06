import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "/src/components/firebase";
import { signOut } from "firebase/auth";
import { Plus, LogOut, Users, Eye, FileDown, Trash2 } from "lucide-react"; // ícones modernos

export default function PricingsList() {
  const [pricings, setPricings] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "pricings"));
      setPricings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Você saiu da sua conta!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleDelete = async () => {
    if (!selected) return alert("Selecione uma precificação!");
    if (!confirm("Tem certeza que deseja excluir esta precificação?")) return;
    await deleteDoc(doc(db, "pricings", selected));
    alert("Excluído com sucesso!");
    setPricings(pricings.filter((p) => p.id !== selected));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* 🔹 Cabeçalho */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">
          📊 Lista de Precificações
        </h2>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>

      {/* 🔹 Botões principais */}
      <div className="w-full max-w-4xl flex flex-wrap justify-end gap-3 mb-8">
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
        >
          <Users size={18} /> Ver Clientes
        </button>

        <button
          onClick={() => navigate("/clients/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Nova Precificação
        </button>
      </div>

      {/* 🔹 Lista */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-4 divide-y divide-gray-100">
        {pricings.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            Nenhuma precificação cadastrada ainda 😅
          </p>
        ) : (
          pricings.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`flex justify-between items-center py-3 px-4 rounded-lg cursor-pointer transition-all ${
                selected === p.id
                  ? "bg-blue-100 border-l-4 border-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {p.equipment_name || "Sem título"}
                </span>
                <span className="text-sm text-gray-500">
                  {p.problem_description || "Sem descrição"}
                </span>
              </div>

              <input
                type="radio"
                checked={selected === p.id}
                readOnly
                className="accent-blue-600"
              />
            </div>
          ))
        )}
      </div>

      {/* 🔹 Ações secundárias */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => selected && navigate(`/pricings/review/${selected}`)}
          disabled={!selected}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow font-medium transition ${
            selected
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Eye size={18} /> Visualizar
        </button>

        <button
          disabled={!selected}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow font-medium transition ${
            selected
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FileDown size={18} /> Exportar PDF
        </button>

        <button
          onClick={handleDelete}
          disabled={!selected}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow font-medium transition ${
            selected
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Trash2 size={18} /> Excluir
        </button>
      </div>

      {/* 🔹 Rodapé */}
      <footer className="mt-12 text-sm text-gray-400">
        Desenvolvido por <span className="text-blue-600">AvanteTech Jr.</span>
      </footer>
    </div>
  );
}
