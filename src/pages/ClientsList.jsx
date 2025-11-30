import { useEffect, useState, useMemo } from "react";
import { db, auth } from "/src/components/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔹 Buscar clientes do Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clients"));
        setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        alert("Erro ao carregar clientes. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // 🔹 Filtro de busca
  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const term = search.toLowerCase();
    return clients.filter((c) =>
      [c.name, c.email, c.phone, c.city_state, c.cnpj]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }, [search, clients]);

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

  // 🔹 Excluir cliente
  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await deleteDoc(doc(db, "clients", id));
      setClients((prev) => prev.filter((c) => c.id !== id));
      alert("Cliente excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
      alert("Erro ao excluir cliente. Tente novamente.");
    }
  };

  // 🔹 Entrar em modo edição
  const handleEdit = (client) => {
    setEditingClient(client.id);
    setEditForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      city_state: client.city_state || "",
      cnpj: client.cnpj || "",
    });
  };

  // 🔹 Salvar cliente
  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, "clients", id), editForm);
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...editForm } : c))
      );
      setEditingClient(null);
      alert("Cliente atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
      alert("Erro ao atualizar cliente. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex justify-center px-4 py-6">
      <div className="w-full max-w-6xl">
        {/* 🎯 Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/70 text-cyan-300 font-bold">
                C
              </span>
              <span>Clientes cadastrados</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Gerencie e edite rapidamente os clientes da Avante Tech Jr.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => navigate("/clients/new")}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-sm md:text-base font-semibold shadow-md transition-transform hover:-translate-y-0.5"
            >
              + Novo cliente
            </button>
            <button
              onClick={() => navigate("/pricings")}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm md:text-base font-medium shadow-md transition-transform hover:-translate-y-0.5"
            >
              Voltar para precificações
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm md:text-base font-medium shadow-md transition-transform hover:-translate-y-0.5"
            >
              Deslogar
            </button>
          </div>
        </header>

        {/* 🔍 Busca */}
        <section className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative w-full md:max-w-sm">
            <input
              type="text"
              placeholder="Buscar por nome, email, cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 rounded-full px-4 py-2 text-sm md:text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
              {filteredClients.length}/{clients.length}
            </span>
          </div>

          <span className="text-xs md:text-sm text-slate-400">
            {clients.length === 0
              ? "Nenhum cliente cadastrado ainda."
              : `Total de clientes: ${clients.length}`}
          </span>
        </section>

        {/* 🧾 Lista */}
        <section className="bg-slate-900/80 rounded-2xl shadow-xl border border-slate-800 p-4 md:p-6">
          {loading ? (
            <p className="text-center text-slate-300 py-10 animate-pulse">
              Carregando clientes...
            </p>
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-slate-300 mb-2">
                Nenhum cliente encontrado com esse filtro.
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-sm text-cyan-400 hover:underline"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <>
              {/* Tabela (desktop) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-left text-slate-200">
                      <th className="p-3 rounded-tl-xl">Nome</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">Cidade/Estado</th>
                      <th className="p-3">CNPJ</th>
                      <th className="p-3 text-center rounded-tr-xl">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((c) => (
                      <tr
                        key={c.id}
                        className={`border-b border-slate-800 last:border-0 ${
                          editingClient === c.id
                            ? "bg-slate-800/70"
                            : "hover:bg-slate-800/40"
                        } transition-colors`}
                      >
                        {editingClient === c.id ? (
                          <>
                            <td className="p-3">
                              <input
                                className="border border-slate-600 bg-slate-900 rounded-md p-2 w-full text-slate-100 text-sm"
                                value={editForm.name}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="p-3">
                              <input
                                className="border border-slate-600 bg-slate-900 rounded-md p-2 w-full text-slate-100 text-sm"
                                value={editForm.email}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="p-3">
                              <input
                                className="border border-slate-600 bg-slate-900 rounded-md p-2 w-full text-slate-100 text-sm"
                                value={editForm.phone}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="p-3">
                              <input
                                className="border border-slate-600 bg-slate-900 rounded-md p-2 w-full text-slate-100 text-sm"
                                value={editForm.city_state}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    city_state: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="p-3">
                              <input
                                className="border border-slate-600 bg-slate-900 rounded-md p-2 w-full text-slate-100 text-sm"
                                value={editForm.cnpj}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    cnpj: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="p-3 text-center">
                              <button
                                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-semibold mr-2 transition"
                                onClick={() => handleSave(c.id)}
                              >
                                Salvar
                              </button>
                              <button
                                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                onClick={() => setEditingClient(null)}
                              >
                                Cancelar
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 font-medium text-slate-100">
                              {c.name}
                            </td>
                            <td className="p-3 text-slate-300">{c.email}</td>
                            <td className="p-3 text-slate-300">{c.phone}</td>
                            <td className="p-3 text-slate-300">
                              {c.city_state}
                            </td>
                            <td className="p-3 text-slate-300">
                              {c.cnpj || "—"}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-semibold mr-2 transition"
                                onClick={() => handleEdit(c)}
                              >
                                Editar
                              </button>
                              <button
                                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                onClick={() => handleDelete(c.id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards (mobile) */}
              <div className="md:hidden space-y-3">
                {filteredClients.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm shadow-sm ${
                      editingClient === c.id ? "ring-2 ring-cyan-400" : ""
                    }`}
                  >
                    {editingClient === c.id ? (
                      <div className="space-y-2">
                        <input
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Nome"
                        />
                        <input
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          placeholder="Email"
                        />
                        <input
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          placeholder="Telefone"
                        />
                        <input
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                          value={editForm.city_state}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              city_state: e.target.value,
                            })
                          }
                          placeholder="Cidade/Estado"
                        />
                        <input
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                          value={editForm.cnpj}
                          onChange={(e) =>
                            setEditForm({ ...editForm, cnpj: e.target.value })
                          }
                          placeholder="CNPJ"
                        />

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-semibold"
                            onClick={() => handleSave(c.id)}
                          >
                            Salvar
                          </button>
                          <button
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                            onClick={() => setEditingClient(null)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between gap-2 mb-1">
                          <p className="font-semibold text-slate-100">
                            {c.name}
                          </p>
                          {c.cnpj && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200">
                              {c.cnpj}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs mb-1">
                          {c.email}
                        </p>
                        <p className="text-slate-400 text-xs mb-1">
                          {c.phone} · {c.city_state}
                        </p>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-semibold"
                            onClick={() => handleEdit(c)}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                            onClick={() => handleDelete(c.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
