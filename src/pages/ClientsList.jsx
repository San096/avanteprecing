import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "/src/components/firebase";
import { signOut } from "firebase/auth";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  // 🔹 Buscar clientes do Firestore
  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
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

  // 🔹 Excluir cliente
  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    await deleteDoc(doc(db, "clients", id));
    setClients(clients.filter((c) => c.id !== id));
    alert("Cliente excluído com sucesso!");
  };

  // 🔹 Editar cliente
  const handleEdit = (client) => {
    setEditingClient(client.id);
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      city_state: client.city_state,
      cnpj: client.cnpj || "",
    });
  };

  const handleSave = async (id) => {
    await updateDoc(doc(db, "clients", id), editForm);
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...editForm } : c))
    );
    setEditingClient(null);
    alert("Cliente atualizado com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Clientes Cadastrados</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/clients/new")}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            + Novo Cliente
          </button>
          <button
            onClick={() => navigate("/pricings")}
            className="bg-gray-400 text-white px-3 py-2 rounded"
          >
            Voltar
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Deslogar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        {clients.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum cliente cadastrado</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2">Nome</th>
                <th className="p-2">Email</th>
                <th className="p-2">Telefone</th>
                <th className="p-2">Cidade/Estado</th>
                <th className="p-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  {editingClient === c.id ? (
                    <>
                      <td className="p-2">
                        <input
                          className="border rounded p-1 w-full"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="border rounded p-1 w-full"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="border rounded p-1 w-full"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="border rounded p-1 w-full"
                          value={editForm.city_state}
                          onChange={(e) =>
                            setEditForm({ ...editForm, city_state: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleSave(c.id)}
                        >
                          Salvar
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={() => setEditingClient(null)}
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2">{c.city_state}</td>
                      <td className="p-2 text-center">
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEdit(c)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
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
        )}
      </div>
    </div>
  );
}
