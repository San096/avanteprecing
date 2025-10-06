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
  const navigate = useNavigate();

  // 🔹 Buscar clientes existentes para o select
  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const docRef = await addDoc(collection(db, "clients"), form);
      alert("✅ Cliente cadastrado com sucesso!");
      navigate(`/pricings/new?clientId=${docRef.id}`);
    } catch (err) {
      console.error(err);
      setError("❌ Erro ao cadastrar cliente");
    }
  };

  const handleGoToPricing = () => {
    if (!existingClientId) return alert("Selecione um cliente existente!");
    navigate(`/pricings/new?clientId=${existingClientId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg flex flex-col gap-6">
          <h2 className="text-center text-2xl font-semibold text-blue-700 mb-2">
            Cadastrar ou Selecionar Cliente
          </h2>

          {/* 🔹 Seção: cliente já cadastrado */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="text-lg font-medium text-blue-700 mb-2">
              Já possui cadastro?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Selecione o cliente abaixo para ir direto à precificação:
            </p>

            <select
              value={existingClientId}
              onChange={(e) => setExistingClientId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.city_state}
                </option>
              ))}
            </select>

            <button
              onClick={handleGoToPricing}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Ir para Precificação
            </button>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="bg-white px-3 text-sm text-gray-500 absolute">
              ou cadastre um novo cliente
            </span>
          </div>

          {/* 🔹 Formulário novo cliente */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              name="name"
              placeholder="Nome da empresa"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
            <input
              type="text"
              name="cnpj"
              placeholder="CNPJ"
              value={form.cnpj}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Endereço"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
            />
            <input
              type="text"
              name="city_state"
              placeholder="Cidade/Estado"
              value={form.city_state}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={form.cep}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
            />
            <input
              type="text"
              name="phone"
              placeholder="Telefone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Salvar Novo Cliente
            </button>
          </form>

          {/* 🔹 Botão voltar */}
          <button
            type="button"
            onClick={() => navigate("/pricings")}
            className="bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
          >
            Voltar para Lista de Preços
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
