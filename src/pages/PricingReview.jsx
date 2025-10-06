import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "/src/components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import jsPDF from "jspdf";
import avanteLogo from "/src/assets/avantelogo.png";
import {
  FileDown,
  ArrowLeftCircle,
  LogOut,
  ClipboardList,
  User,
  Info,
} from "lucide-react";

export default function PricingReview() {
  const { id } = useParams();
  const [pricing, setPricing] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const companyData = {
    name: "AvanteTech Jr.",
    cnpj: "55.625.728/0001-09",
    address:
      "Avenida Jose de Freitas Queiroz, 5003 - Cedro - Quixadá/CE - CEP 63.902-580",
    phone: "(88) 9618-8715",
    email: "avantetechjr@gmail.com",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pricingRef = doc(db, "pricings", id);
        const pricingSnap = await getDoc(pricingRef);

        if (!pricingSnap.exists()) {
          alert("Precificação não encontrada!");
          navigate("/pricings");
          return;
        }

        const pricingData = { id: pricingSnap.id, ...pricingSnap.data() };
        setPricing(pricingData);

        if (pricingData.clientId) {
          const clientRef = doc(db, "clients", pricingData.clientId);
          const clientSnap = await getDoc(clientRef);
          if (clientSnap.exists()) {
            setClient({ id: clientSnap.id, ...clientSnap.data() });
          }
        }
      } catch (err) {
        console.error("Erro ao carregar revisão:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const drawSectionTitle = (pdf, title, y) => {
    pdf.setFillColor(0, 102, 204);
    pdf.rect(10, y, 190, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(title, 105, y + 6, { align: "center" });
    pdf.setTextColor(0, 0, 0);
    return y + 14;
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;
    pdf.addImage(avanteLogo, "PNG", 10, 10, 20, 20);
    pdf.setFontSize(16);
    pdf.text("Orçamento Detalhado", 105, y, { align: "center" });
    y += 20;

    y = drawSectionTitle(pdf, "Consultoria", y);
    pdf.setFontSize(10);
    pdf.text(`Nome: ${companyData.name}`, 10, y); y += 6;
    pdf.text(`CNPJ: ${companyData.cnpj}`, 10, y); y += 6;
    pdf.text(`Endereço: ${companyData.address}`, 10, y); y += 6;
    pdf.text(`Telefone: ${companyData.phone}`, 10, y); y += 6;
    pdf.text(`Email: ${companyData.email}`, 10, y); y += 10;

    y = drawSectionTitle(pdf, "Cliente", y);
    pdf.text(`Nome: ${client?.name || ""}`, 10, y); y += 6;
    pdf.text(`Email: ${client?.email || ""}`, 10, y); y += 6;
    pdf.text(`Telefone: ${client?.phone || ""}`, 10, y); y += 6;
    pdf.text(`Cidade/Estado: ${client?.city_state || ""}`, 10, y); y += 10;

    y = drawSectionTitle(pdf, "Procedimentos & Cronograma", y);
    if (pricing?.procedures?.length > 0) {
      pricing.procedures.forEach((p, i) => {
        pdf.text(`${i + 1}. ${p.description} — ${p.days} dias`, 10, y);
        y += 6;
      });
    } else {
      pdf.text("Nenhum procedimento informado", 10, y);
      y += 6;
    }

    y = drawSectionTitle(pdf, "Precificação", y);
    pdf.text(`Código: ${pricing?.codigo}`, 10, y); y += 6;
    pdf.text(`Descrição: ${pricing?.problem_description}`, 10, y); y += 6;
    pdf.text(`Devs: ${pricing?.devs}`, 10, y); y += 6;
    pdf.text(`Dias úteis: ${pricing?.business_days}`, 10, y); y += 6;
    pdf.text(`Horas/dia: ${pricing?.hours_per_day}`, 10, y); y += 6;
    pdf.text(`Total de horas: ${pricing?.total_hours}`, 10, y); y += 6;
    pdf.text(`Valor hora: R$ ${pricing?.hourly_rate}`, 10, y); y += 6;
    pdf.text(`Custo total: R$ ${pricing?.total_cost}`, 10, y); y += 10;

    y = drawSectionTitle(pdf, "Formalização", y);
    pdf.setFontSize(10);
    pdf.text(
      `Criado em: ${
        pricing?.created_at?.seconds
          ? new Date(pricing.created_at.seconds * 1000).toLocaleString()
          : ""
      }`,
      10,
      y
    );

    y += 20;
    pdf.line(20, 260, 190, 260);
    pdf.setFontSize(12);
    pdf.text("Assinatura do Diretor Financeiro", 105, 270, { align: "center" });
    pdf.save(`Precificacao-${pricing?.codigo}.pdf`);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="animate-pulse text-lg">Carregando dados...</p>
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

          {/* Seção Cliente */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <User size={20} />
              <h3 className="text-lg font-semibold">Informações do Cliente</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
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

          {/* Seção Precificação */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <Info size={20} />
              <h3 className="text-lg font-semibold">
                Informações da Precificação
              </h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700">
              <p><strong>Código:</strong> {pricing.codigo}</p>
              <p><strong>Descrição:</strong> {pricing.problem_description}</p>
              <p><strong>Devs:</strong> {pricing.devs}</p>
              <p><strong>Dias úteis:</strong> {pricing.business_days}</p>
              <p><strong>Horas/dia:</strong> {pricing.hours_per_day}</p>
              <p><strong>Total de horas:</strong> {pricing.total_hours}</p>
              <p><strong>Valor hora:</strong> R$ {pricing.hourly_rate}</p>
              <p className="text-blue-700 font-semibold mt-2">
                <strong>Custo total:</strong> R$ {pricing.total_cost}
              </p>
            </div>
          </section>

          {/* Seção Procedimentos */}
          <section>
            <div className="flex items-center gap-2 mb-2 text-purple-600">
              <ClipboardList size={20} />
              <h3 className="text-lg font-semibold">Procedimentos</h3>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700">
              {pricing?.procedures?.length > 0 ? (
                <ul className="list-disc ml-5">
                  {pricing.procedures.map((p, i) => (
                    <li key={i}>
                      {p.description} — {p.days} dias
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum procedimento informado</p>
              )}
            </div>
          </section>

          {/* Botões */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={handleExportPDF}
            >
              <FileDown size={18} /> Exportar PDF
            </button>

            <button
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
              onClick={() => navigate("/pricings")}
            >
              <ArrowLeftCircle size={18} /> Voltar
            </button>

            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
