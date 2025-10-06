import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "/src/components/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import jsPDF from "jspdf";
import { FileDown, ClipboardList, User, Info, Building2, ArrowLeftCircle } from "lucide-react";

// 🔹 Dados fixos da consultoria
const companyData = {
  name: "AvanteTech Jr.",
  cnpj: "55.625.728/0001-09",
  address: "Avenida Jose de Freitas Queiroz, 5003 - Cedro - Quixadá/CE - CEP 63.902-580",
  phone: "(88) 9618-8715",
  email: "avantetechjr@gmail.com",
};

export default function PricingDetail() {
  const { id } = useParams();
  const [pricing, setPricing] = useState(null);
  const [client, setClient] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricingAndClient = async () => {
      try {
        // Precificação
        const pricingRef = doc(db, "pricings", id);
        const pricingSnap = await getDoc(pricingRef);

        if (!pricingSnap.exists()) {
          alert("Precificação não encontrada!");
          navigate("/pricings");
          return;
        }

        const pricingData = { id: pricingSnap.id, ...pricingSnap.data() };
        setPricing(pricingData);

        // Cliente
        if (pricingData.clientId) {
          const clientRef = doc(db, "clients", pricingData.clientId);
          const clientSnap = await getDoc(clientRef);
          if (clientSnap.exists()) {
            setClient({ id: clientSnap.id, ...clientSnap.data() });
          }
        }

        // Procedimentos
        const q = query(
          collection(db, "procedures"),
          where("pricingId", "==", pricingSnap.id)
        );
        const proceduresSnap = await getDocs(q);
        setProcedures(proceduresSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingAndClient();
  }, [id, navigate]);

  // 🔹 Gerar PDF
  const generatePDF = () => {
    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(16);
    pdf.text("Revisão da Precificação", 105, y, { align: "center" });
    y += 15;

    // Consultoria
    pdf.setFontSize(12);
    pdf.text("Consultoria:", 10, y); y += 6;
    pdf.setFontSize(10);
    pdf.text(`${companyData.name}`, 10, y); y += 6;
    pdf.text(`CNPJ: ${companyData.cnpj}`, 10, y); y += 6;
    pdf.text(`${companyData.address}`, 10, y); y += 6;
    pdf.text(`${companyData.phone} - ${companyData.email}`, 10, y);
    y += 10;

    // Cliente
    pdf.setFontSize(12);
    pdf.text("Cliente:", 10, y); y += 6;
    pdf.setFontSize(10);
    pdf.text(`Nome: ${client?.name || "-"}`, 10, y); y += 6;
    pdf.text(`Email: ${client?.email || "-"}`, 10, y); y += 6;
    pdf.text(`Telefone: ${client?.phone || "-"}`, 10, y); y += 6;
    pdf.text(`Cidade/Estado: ${client?.city_state || "-"}`, 10, y);
    y += 10;

    // Procedimentos
    pdf.setFontSize(12);
    pdf.text("Procedimentos & Cronograma:", 10, y); y += 6;
    pdf.setFontSize(10);
    if (procedures.length > 0) {
      procedures.forEach((p, index) => {
        pdf.text(`${index + 1}. ${p.description} — ${p.days} dias`, 10, y);
        y += 6;
      });
    } else {
      pdf.text("Nenhum procedimento informado", 10, y);
      y += 6;
    }

    // Precificação
    pdf.setFontSize(12);
    pdf.text("Informações da Precificação:", 10, y); y += 6;
    pdf.setFontSize(10);
    pdf.text(`Código: ${pricing?.codigo}`, 10, y); y += 6;
    pdf.text(`Descrição: ${pricing?.problem_description}`, 10, y); y += 6;
    pdf.text(`Devs: ${pricing?.devs}`, 10, y); y += 6;
    pdf.text(`Dias úteis: ${pricing?.business_days}`, 10, y); y += 6;
    pdf.text(`Horas/dia: ${pricing?.hours_per_day}`, 10, y); y += 6;
    pdf.text(`Total de horas: ${pricing?.total_hours}`, 10, y); y += 6;
    pdf.text(`Valor hora: R$ ${pricing?.hourly_rate}`, 10, y); y += 6;
    pdf.text(`Custo total: R$ ${pricing?.total_cost}`, 10, y); y += 10;

    // Assinatura
    y += 20;
    pdf.text("_________________________", 10, y); y += 6;
    pdf.text("Diretor Financeiro", 10, y);

    pdf.save(`Precificacao-${pricing?.codigo}.pdf`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg animate-pulse">
        Carregando dados...
      </div>
    );

  if (!pricing) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center flex-1 px-4 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-8">
            Revisão da Precificação
          </h2>

          {/* 🔹 Consultoria */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Building2 size={20} />
              <h3 className="text-lg font-semibold">Consultoria</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <p><strong>{companyData.name}</strong></p>
              <p>CNPJ: {companyData.cnpj}</p>
              <p>{companyData.address}</p>
              <p>{companyData.phone} — {companyData.email}</p>
            </div>
          </section>

          {/* 🔹 Cliente */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-purple-600">
              <User size={20} />
              <h3 className="text-lg font-semibold">Cliente</h3>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700">
              {client ? (
                <>
                  <p><strong>Nome:</strong> {client.name}</p>
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Telefone:</strong> {client.phone}</p>
                  <p><strong>Cidade/Estado:</strong> {client.city_state}</p>
                </>
              ) : (
                <p>Cliente não encontrado</p>
              )}
            </div>
          </section>

          {/* 🔹 Precificação */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <Info size={20} />
              <h3 className="text-lg font-semibold">Informações da Precificação</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700">
              <p><strong>Código:</strong> {pricing.codigo}</p>
              <p><strong>Descrição:</strong> {pricing.problem_description}</p>
              <p><strong>Devs:</strong> {pricing.devs}</p>
              <p><strong>Dias úteis:</strong> {pricing.business_days}</p>
              <p><strong>Horas/dia:</strong> {pricing.hours_per_day}</p>
              <p><strong>Total de horas:</strong> {pricing.total_hours}</p>
              <p><strong>Valor hora:</strong> R$ {pricing.hourly_rate}</p>
              <p className="font-semibold text-blue-700 mt-2">
                <strong>Custo total:</strong> R$ {pricing.total_cost}
              </p>
            </div>
          </section>

          {/* 🔹 Procedimentos */}
          <section>
            <div className="flex items-center gap-2 mb-2 text-orange-600">
              <ClipboardList size={20} />
              <h3 className="text-lg font-semibold">Procedimentos & Cronograma</h3>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-sm text-gray-700">
              {procedures.length > 0 ? (
                <ul className="list-disc ml-5">
                  {procedures.map((p) => (
                    <li key={p.id}>
                      {p.description} — {p.days} dias
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum procedimento informado</p>
              )}
            </div>
          </section>

          {/* 🔹 Botões */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              <FileDown size={18} /> Exportar PDF
            </button>

            <button
              onClick={() => navigate("/pricings")}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
            >
              <ArrowLeftCircle size={18} /> Voltar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
