import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "/src/components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
  Pencil,
  Save,
  XCircle,
} from "lucide-react";

export default function PricingReview() {
  const { id } = useParams();
  const [pricing, setPricing] = useState(null);
  const [originalPricing, setOriginalPricing] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 🔹 Dados fixos da AvanteTech Jr.
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
        setOriginalPricing(pricingData);

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

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  // 🔹 Faixa azul do título no PDF
  const drawSectionTitle = (pdf, title, y) => {
    pdf.setFillColor(0, 102, 204); // azul Avante
    pdf.rect(10, y, 190, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(title, 105, y + 6, { align: "center" });
    pdf.setTextColor(0, 0, 0);
    return y + 14;
  };

  // 🔹 Quebra de linha no PDF
  const addWrappedText = (pdf, text, x, y, maxWidth = 180, lineHeight = 6) => {
    if (!text) return y;
    const lines = pdf.splitTextToSize(String(text), maxWidth);
    lines.forEach((line) => {
      pdf.text(line, x, y);
      y += lineHeight;
    });
    return y;
  };

  // 🔹 Exportar PDF com quebra de linha
  const handleExportPDF = () => {
    if (!pricing) return;

    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;

    // Logo e título
    pdf.addImage(avanteLogo, "PNG", 10, 10, 20, 20);
    pdf.setFontSize(16);
    pdf.text("Orçamento Detalhado", 105, y, { align: "center" });
    y += 20;

    // Consultoria
    y = drawSectionTitle(pdf, "Consultoria", y);
    pdf.setFontSize(10);
    y = addWrappedText(pdf, `Nome: ${companyData.name}`, 10, y);
    y = addWrappedText(pdf, `CNPJ: ${companyData.cnpj}`, 10, y);
    y = addWrappedText(pdf, `Endereço: ${companyData.address}`, 10, y);
    y = addWrappedText(
      pdf,
      `Telefone: ${companyData.phone}  |  Email: ${companyData.email}`,
      10,
      y
    );
    y += 4;

    // Cliente
    y = drawSectionTitle(pdf, "Cliente", y);
    y = addWrappedText(pdf, `Nome: ${client?.name || ""}`, 10, y);
    y = addWrappedText(pdf, `Email: ${client?.email || ""}`, 10, y);
    y = addWrappedText(pdf, `Telefone: ${client?.phone || ""}`, 10, y);
    y = addWrappedText(
      pdf,
      `Cidade/Estado: ${client?.city_state || ""}`,
      10,
      y
    );
    y += 4;

    // Procedimentos
    y = drawSectionTitle(pdf, "Procedimentos & Cronograma", y);
    if (pricing?.procedures?.length > 0) {
      pricing.procedures.forEach((p, i) => {
        const line = `${i + 1}. ${p.description || ""} — ${
          p.days ?? 0
        } dias`;
        y = addWrappedText(pdf, line, 10, y);
      });
    } else {
      y = addWrappedText(pdf, "Nenhum procedimento informado", 10, y);
    }

    // Precificação
    y = drawSectionTitle(pdf, "Precificação", y);
    y = addWrappedText(pdf, `Código: ${pricing?.codigo}`, 10, y);
    y = addWrappedText(
      pdf,
      `Descrição: ${pricing?.problem_description || ""}`,
      10,
      y
    );
    y = addWrappedText(pdf, `Devs: ${pricing?.devs}`, 10, y);
    y = addWrappedText(
      pdf,
      `Dias úteis: ${pricing?.business_days}`,
      10,
      y
    );
    y = addWrappedText(
      pdf,
      `Horas/dia: ${pricing?.hours_per_day}`,
      10,
      y
    );
    y = addWrappedText(
      pdf,
      `Total de horas: ${pricing?.total_hours}`,
      10,
      y
    );
    y = addWrappedText(
      pdf,
      `Valor hora: R$ ${pricing?.hourly_rate}`,
      10,
      y
    );
    y = addWrappedText(
      pdf,
      `Custo total: R$ ${pricing?.total_cost}`,
      10,
      y
    );
    y += 4;

    // Formalização
    y = drawSectionTitle(pdf, "Formalização", y);
    pdf.setFontSize(10);
    y = addWrappedText(
      pdf,
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

  // 🔹 Modo edição
  const handleStartEdit = () => {
    setOriginalPricing(pricing);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (originalPricing) setPricing(originalPricing);
    setIsEditing(false);
  };

  const handleChangeField = (field, value) => {
    setPricing((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeProcedure = (index, field, value) => {
    setPricing((prev) => {
      const currentProcedures = prev.procedures || [];
      const updated = [...currentProcedures];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, procedures: updated };
    });
  };

  const handleAddProcedure = () => {
    setPricing((prev) => ({
      ...prev,
      procedures: [...(prev.procedures || []), { description: "", days: 0 }],
    }));
  };

  const handleSaveChanges = async () => {
    if (!pricing) return;
    setSaving(true);

    try {
      const devs = Number(pricing.devs || 0);
      const businessDays = Number(pricing.business_days || 0);
      const hoursPerDay = Number(pricing.hours_per_day || 0);
      const hourlyRate = Number(pricing.hourly_rate || 0);

      const total_hours = devs * businessDays * hoursPerDay;
      const total_cost = total_hours * hourlyRate;

      const { id: pricingId, ...dataToUpdate } = pricing;

      const updatedData = {
        ...dataToUpdate,
        devs,
        business_days: businessDays,
        hours_per_day: hoursPerDay,
        hourly_rate: hourlyRate,
        total_hours,
        total_cost,
        procedures: (pricing.procedures || []).map((p) => ({
          description: p.description || "",
          days: Number(p.days || 0),
        })),
      };

      await updateDoc(doc(db, "pricings", pricingId), updatedData);

      setPricing({ id: pricingId, ...updatedData });
      setOriginalPricing({ id: pricingId, ...updatedData });
      setIsEditing(false);
      alert("Precificação atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      alert("❌ Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#042433] text-slate-200">
        <p className="animate-pulse text-lg">Carregando dados...</p>
      </div>
    );

  if (!pricing) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#042433] text-slate-100">
      <Header />
      <main className="flex flex-col items-center flex-1 px-4 py-8">
        <div className="w-full max-w-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-white">
            Revisão da Precificação
          </h2>

          {/* Cliente */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-[#ff6b35]">
              <User size={20} />
              <h3 className="text-lg font-semibold">Informações do Cliente</h3>
            </div>
            <div className="bg-slate-950/70 rounded-lg p-4 text-sm space-y-1 border border-slate-800">
              {client ? (
                <>
                  <p>
                    <strong>Nome:</strong> {client.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {client.email}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {client.phone}
                  </p>
                  <p>
                    <strong>Cidade/Estado:</strong> {client.city_state}
                  </p>
                </>
              ) : (
                <p>Cliente não encontrado</p>
              )}
            </div>
          </section>

          {/* Precificação */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-[#ff6b35]">
              <Info size={20} />
              <h3 className="text-lg font-semibold">
                Informações da Precificação
              </h3>
            </div>

            {!isEditing ? (
              <div className="bg-slate-950/70 rounded-lg p-4 text-sm space-y-1 border border-slate-800">
                <p>
                  <strong>Código:</strong> {pricing.codigo}
                </p>
                <p className="whitespace-pre-line break-words">
                  <strong>Descrição:</strong> {pricing.problem_description}
                </p>
                <p>
                  <strong>Devs:</strong> {pricing.devs}
                </p>
                <p>
                  <strong>Dias úteis:</strong> {pricing.business_days}
                </p>
                <p>
                  <strong>Horas/dia:</strong> {pricing.hours_per_day}
                </p>
                <p>
                  <strong>Total de horas:</strong> {pricing.total_hours}
                </p>
                <p>
                  <strong>Valor hora:</strong> R$ {pricing.hourly_rate}
                </p>
                <p className="mt-1 text-[#ff6b35] font-semibold">
                  <strong>Custo total:</strong> R$ {pricing.total_cost}
                </p>
              </div>
            ) : (
              <div className="bg-slate-950/70 rounded-lg p-4 text-sm space-y-3 border border-slate-800">
                <p>
                  <strong>Código:</strong> {pricing.codigo}
                </p>

                <div>
                  <label className="text-xs font-medium block mb-1">
                    Descrição do problema
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] whitespace-pre-line"
                    value={pricing.problem_description || ""}
                    onChange={(e) =>
                      handleChangeField("problem_description", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">
                      Devs
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      value={pricing.devs ?? 1}
                      onChange={(e) =>
                        handleChangeField("devs", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1">
                      Dias úteis
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      value={pricing.business_days ?? 1}
                      onChange={(e) =>
                        handleChangeField(
                          "business_days",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1">
                      Horas/dia
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      value={pricing.hours_per_day ?? 1}
                      onChange={(e) =>
                        handleChangeField(
                          "hours_per_day",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1">
                      Valor hora (R$)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      value={pricing.hourly_rate ?? 0}
                      onChange={(e) =>
                        handleChangeField(
                          "hourly_rate",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Procedimentos */}
          <section>
            <div className="flex items-center gap-2 mb-2 text-[#ff6b35]">
              <ClipboardList size={20} />
              <h3 className="text-lg font-semibold">Procedimentos</h3>
            </div>

            {!isEditing ? (
              <div className="bg-slate-950/70 rounded-lg p-4 text-sm border border-slate-800">
                {pricing?.procedures?.length > 0 ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {pricing.procedures.map((p, i) => (
                      <li
                        key={i}
                        className="whitespace-pre-line break-words"
                      >
                        {p.description} — {p.days} dias
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-300">
                    Nenhum procedimento informado
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/70 rounded-lg p-4 text-sm border border-slate-800 flex flex-col gap-3">
                {(pricing.procedures || []).map((p, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-2 items-start"
                  >
                    <textarea
                      className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] resize-y whitespace-pre-line"
                      rows={2}
                      value={p.description || ""}
                      onChange={(e) =>
                        handleChangeProcedure(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Descrição do procedimento"
                    />
                    <div className="w-full md:w-24">
                      <label className="text-xs font-medium block mb-1">
                        Dias
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                        value={p.days ?? 0}
                        onChange={(e) =>
                          handleChangeProcedure(
                            index,
                            "days",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddProcedure}
                  className="mt-1 self-start bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-full transition border border-slate-600"
                >
                  + Adicionar procedimento
                </button>
              </div>
            )}
          </section>

          {/* Botões */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              onClick={handleExportPDF}
            >
              <FileDown size={18} /> Exportar PDF
            </button>

            {!isEditing ? (
              <>
                <button
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                  onClick={handleStartEdit}
                >
                  <Pencil size={18} /> Editar
                </button>

                <button
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                  onClick={() => navigate("/pricings")}
                >
                  <ArrowLeftCircle size={18} /> Voltar
                </button>
              </>
            ) : (
              <>
                <button
                  className={`flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition ${
                    saving
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>

                <button
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <XCircle size={18} /> Cancelar
                </button>
              </>
            )}

            <button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
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
