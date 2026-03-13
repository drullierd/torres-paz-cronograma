"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Target,
  Zap,
  Ban
} from "lucide-react";

export default function TorresPazDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const today = new Date("2026-08-15");

  const projectHeader = {
    name: "TORRES PAZ II",
    location: "Barranco, Lima",
    units: 30,
    floors: 9,
    baseline: {
      startDate: new Date("2026-03-23"),
      endDate: new Date("2027-04-06"),
      durationDays: 259,
      totalBudget: 3200000
    },
    current: {
      progressPct: 38,
      forecastEndDate: new Date("2027-05-25"),
      deviationDays: 49,
      budgetSpent: 1450000,
      daysElapsed: 145
    },
    health: "red"
  };

  const phases = [
    {
      id: "PREL",
      code: "01.01",
      name: "PRELIMINARES",
      baseline: { start: new Date("2026-03-23"), end: new Date("2026-04-07"), days: 10 },
      current: { progressPct: 100, budgetSpent: 102000 },
      isCritical: true,
      health: "yellow",
      responsible: "Ing. Roberto Silva",
      deviationDays: 2
    },
    {
      id: "ESTR",
      code: "01.02",
      name: "ESTRUCTURAS",
      baseline: { start: new Date("2026-04-08"), end: new Date("2026-10-12"), days: 127 },
      current: { progressPct: 62, budgetSpent: 920000 },
      isCritical: true,
      health: "red",
      responsible: "Ing. Carlos Mendoza",
      deviationDays: 49
    },
    {
      id: "ARQ_ALB",
      code: "01.03",
      name: "ARQUITECTURA - ALB. Y O.H.",
      baseline: { start: new Date("2026-09-02"), end: new Date("2026-12-11"), days: 70 },
      current: { progressPct: 8 },
      isCritical: true,
      health: "yellow",
      responsible: "Arq. Patricia Rojas",
      deviationDays: 49
    },
    {
      id: "ARQ_ACAB",
      code: "01.04",
      name: "ARQUITECTURA - ACABADOS",
      baseline: { start: new Date("2026-10-22"), end: new Date("2027-03-22"), days: 105 },
      current: { progressPct: 0 },
      isCritical: true,
      health: "yellow",
      responsible: "Arq. Patricia Rojas"
    },
    {
      id: "IISS",
      code: "01.05",
      name: "IISS - ACABADOS",
      baseline: { start: new Date("2026-11-05"), end: new Date("2027-01-18"), days: 50 },
      current: { progressPct: 0 },
      isCritical: false,
      health: "green",
      responsible: "Ing. Manuel Torres",
      totalFloat: 28
    },
    {
      id: "IIEE",
      code: "01.06",
      name: "IIEE - ACABADOS",
      baseline: { start: new Date("2026-11-05"), end: new Date("2027-02-01"), days: 60 },
      current: { progressPct: 0 },
      isCritical: false,
      health: "green",
      responsible: "Ing. Luis Fernández",
      totalFloat: 21
    }
  ];

  const topRisks = [
    {
      id: "R1",
      description: "Atraso de 49 días en ESTRUCTURAS arrastra todas las fases críticas",
      impact: "Penalidad contractual $147k + retraso de cobros $980k",
      owner: "Jefe de Proyecto - Ing. Carlos Mendoza",
      action: "URGENTE: Fast-track pisos 7-9 con doble turno + cuadrilla adicional ($125k)",
      severity: "critical",
      financialExposure: 1252000
    },
    {
      id: "R2",
      description: "Progreso real 38% vs 56% planificado (brecha de -18 puntos)",
      impact: "Alto riesgo de NO alcanzar 35% para desembolso bancario del 10-Sep ($640k)",
      owner: "Gerente de Obra - Ing. Roberto Silva",
      action: "Priorizar partidas críticas: terminar Piso 7+8 antes del 5-Sep",
      severity: "critical",
      financialExposure: 640000
    },
    {
      id: "R3",
      description: "9 restricciones críticas sin resolver en lookahead de 15 días",
      impact: "Podrían generar 20-25 días adicionales de atraso",
      owner: "PMO - Daniela Guerrero",
      action: "War room DIARIO a las 7am hasta cerrar TODAS las restricciones",
      severity: "high",
      financialExposure: 450000
    }
  ];

  const activitiesOverdue = [
    {
      id: "A1",
      name: "Vaciado de concreto losa Piso 6",
      phaseCode: "01.02",
      responsible: "Residente Juan Pérez",
      daysOverdue: 7,
      progressPct: 80,
      isCritical: true,
      blocker: "Retraso en entrega de acero corrugado - proveedor reporta 5 días adicionales"
    },
    {
      id: "A2",
      name: "Instalación columnas metálicas Piso 7",
      phaseCode: "01.02",
      responsible: "Subcontratista ACEROMAX",
      daysOverdue: 4,
      progressPct: 65,
      isCritical: true,
      blocker: "Lluvias intensas 3 días consecutivos paralizaron trabajo en altura"
    },
    {
      id: "A3",
      name: "Aprobación de planos modificados sótanos",
      phaseCode: "01.03",
      responsible: "Arq. Patricia Rojas",
      daysOverdue: 10,
      progressPct: 95,
      isCritical: false,
      blocker: "Pendiente respuesta RFI-052 de municipalidad sobre estacionamientos"
    }
  ];

  const planVsRealData = useMemo(() => {
    const data = [];
    const startDate = new Date("2026-03-23");
    const totalDays = 308;

    for (let i = 0; i <= totalDays; i += 14) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      const sCurvePlan = 100 / (1 + Math.exp(-0.05 * (i - 129)));

      let realProgress = null;
      if (i <= 145) {
        realProgress = Math.min(100, sCurvePlan * 0.68);
      }

      let forecastProgress = null;
      if (i > 145) {
        const remaining = 100 - 38;
        const daysLeft = totalDays - 145;
        forecastProgress = 38 + ((i - 145) / daysLeft) * remaining;
      }

      data.push({
        date: currentDate.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }),
        planificado: Math.round(sCurvePlan),
        real: realProgress ? Math.round(realProgress) : null,
        forecast: forecastProgress ? Math.round(forecastProgress) : null
      });
    }

    return data;
  }, []);

  const phaseProgressData = phases
    .filter((p) => p.isCritical)
    .map((p) => ({
      name: p.code,
      planificado:
        Math.min(
          100,
          ((today - p.baseline.start) / (p.baseline.end - p.baseline.start)) * 100
        ) || 0,
      real: p.current.progressPct || 0
    }));

  const KPICard = ({ icon, label, value, color = "#F9423A", subtext }) => (
    <div
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
        padding: "1.5rem",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            background: `${color}15`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color
          }}
        >
          {icon}
        </div>
        <div
          style={{
            flex: 1,
            fontSize: "0.75rem",
            color: "#6B7280",
            fontWeight: 700,
            textTransform: "uppercase",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.05em"
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 900,
          color: "#1F2937",
          fontFamily: '"Arial Black", Arial, sans-serif',
          letterSpacing: "-0.02em"
        }}
      >
        {value}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#9CA3AF",
            marginTop: "0.5rem",
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );

  const tabButtonStyle = (isActive) => ({
    padding: "1rem 1.5rem",
    background: isActive ? "#F9423A" : "transparent",
    border: "none",
    borderBottom: isActive ? "4px solid #F9423A" : "4px solid transparent",
    color: isActive ? "#FFFFFF" : "#6B7280",
    fontWeight: 900,
    fontSize: "0.8rem",
    fontFamily: '"Arial Black", Arial, sans-serif',
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div
        style={{
          background: "#F9423A",
          padding: "2rem 3rem",
          borderBottom: "4px solid #DC2626",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "1.5rem",
              gap: "1rem",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  fontFamily: '"Arial Black", Arial, sans-serif',
                  color: "#FFFFFF",
                  marginBottom: "0.75rem",
                  letterSpacing: "0.1em"
                }}
              >
                SOLAR
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2.25rem",
                  fontWeight: 900,
                  fontFamily: '"Arial Black", Arial, sans-serif',
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em"
                }}
              >
                {projectHeader.name}
              </h1>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  fontSize: "0.95rem",
                  color: "#FFFFFF",
                  opacity: 0.95,
                  fontWeight: 700,
                  fontFamily: "Arial, sans-serif"
                }}
              >
                {projectHeader.location} · {projectHeader.units} departamentos · {projectHeader.floors} pisos
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  padding: "0.5rem 1rem",
                  background:
                    projectHeader.health === "red"
                      ? "#7F1D1D"
                      : projectHeader.health === "yellow"
                      ? "#F59E0B"
                      : "#10B981",
                  borderRadius: "8px",
                  marginBottom: "0.75rem"
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    fontFamily: '"Arial Black", Arial, sans-serif',
                    letterSpacing: "0.05em"
                  }}
                >
                  {projectHeader.health === "red"
                    ? "🔴 CRÍTICO"
                    : projectHeader.health === "yellow"
                    ? "⚠️ ALERTA"
                    : "✅ EN TIEMPO"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#FFFFFF",
                  opacity: 0.9,
                  fontFamily: "Arial, sans-serif"
                }}
              >
                Actualizado:{" "}
                {today.toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem"
            }}
          >
            <KPICard
              icon={<Target size={24} />}
              label="Progreso Real"
              value={`${projectHeader.current.progressPct}%`}
              subtext={`vs ${Math.round(
                (projectHeader.current.daysElapsed / projectHeader.baseline.durationDays) * 100
              )}% planificado`}
              color="#F9423A"
            />
            <KPICard
              icon={<Clock size={24} />}
              label="Desviación"
              value={`+${projectHeader.current.deviationDays}d`}
              subtext="Atraso acumulado"
              color="#DC2626"
            />
            <KPICard
              icon={<Calendar size={24} />}
              label="Forecast Término"
              value={projectHeader.current.forecastEndDate.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short"
              })}
              subtext={`Baseline: ${projectHeader.baseline.endDate.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short"
              })}`}
              color="#F59E0B"
            />
            <KPICard
              icon={<AlertTriangle size={24} />}
              label="Alertas Críticas"
              value={activitiesOverdue.length + 5}
              subtext={`${activitiesOverdue.length} vencidas, 5 hitos en riesgo`}
              color="#F9423A"
            />
            <KPICard
              icon={<DollarSign size={24} />}
              label="Gastado"
              value={`$${(projectHeader.current.budgetSpent / 1000000).toFixed(2)}M`}
              subtext={`de $${(projectHeader.baseline.totalBudget / 1000000).toFixed(2)}M (45%)`}
              color="#10B981"
            />
            <KPICard
              icon={<Zap size={24} />}
              label="SPI / CPI"
              value="0.68 / 0.84"
              subtext="Schedule & Cost Performance"
              color="#8B5CF6"
            />
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 3rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
            {[
              { id: "resumen", label: "RESUMEN EJECUTIVO" },
              { id: "lookahead", label: "LOOKAHEAD 15D" },
              { id: "criticos", label: "RUTA CRÍTICA" },
              { id: "hitos", label: "HITOS" },
              { id: "impacto", label: "IMPACTO NEGOCIO" }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButtonStyle(activeTab === tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 3rem" }}>
        {activeTab === "resumen" && (
          <div style={{ display: "grid", gap: "2rem" }}>
            <div
              style={{
                background: "#FEF2F2",
                border: "3px solid #F9423A",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(249, 66, 58, 0.15)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <AlertTriangle size={32} color="#F9423A" />
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    fontFamily: '"Arial Black", Arial, sans-serif',
                    color: "#7F1D1D",
                    letterSpacing: "0.02em"
                  }}
                >
                  RIESGOS CRÍTICOS - ACCIÓN INMEDIATA REQUERIDA
                </h2>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                {topRisks.map((risk, idx) => (
                  <div
                    key={risk.id}
                    style={{
                      background: "#FFFFFF",
                      padding: "1.25rem",
                      borderRadius: "8px",
                      borderLeft: `6px solid ${risk.severity === "critical" ? "#F9423A" : "#F59E0B"}`,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 900,
                          color: "#F9423A",
                          fontFamily: '"Arial Black", Arial, sans-serif'
                        }}
                      >
                        RIESGO #{idx + 1} - {risk.severity.toUpperCase()}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#1F2937",
                        marginBottom: "0.5rem",
                        fontFamily: "Arial, sans-serif"
                      }}
                    >
                      {risk.description}
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#F9423A",
                        marginBottom: "0.75rem",
                        fontWeight: 700,
                        fontFamily: "Arial, sans-serif"
                      }}
                    >
                      💰 Exposición: ${(risk.financialExposure / 1000).toFixed(0)}k USD
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#374151",
                        marginBottom: "0.75rem",
                        padding: "0.75rem",
                        background: "#F9FAFB",
                        borderRadius: "6px",
                        fontFamily: 'Georgia, "Times New Roman", serif'
                      }}
                    >
                      <strong style={{ fontFamily: "Arial, sans-serif" }}>Impacto:</strong> {risk.impact}
                    </div>

                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#374151",
                        fontFamily: 'Georgia, "Times New Roman", serif'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, fontFamily: "Arial, sans-serif" }}>Owner:</span> {risk.owner}
                      </div>
                      <div
                        style={{
                          padding: "0.75rem",
                          background: "#FEF3C7",
                          borderRadius: "6px",
                          borderLeft: "4px solid #F59E0B",
                          marginTop: "0.5rem"
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 900,
                            color: "#92400E",
                            fontFamily: '"Arial Black", Arial, sans-serif'
                          }}
                        >
                          ⚡ ACCIÓN:
                        </span>{" "}
                        {risk.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "#F9423A",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: "1rem",
                  fontFamily: '"Arial Black", Arial, sans-serif',
                  letterSpacing: "0.02em"
                }}
              >
                ⚠️ EXPOSICIÓN TOTAL DE RIESGO: $
                {((topRisks.reduce((sum, r) => sum + r.financialExposure, 0)) / 1000).toFixed(0)}k USD
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                padding: "2rem",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
            >
              <h2
                style={{
                  margin: "0 0 1.5rem 0",
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  fontFamily: '"Arial Black", Arial, sans-serif',
                  color: "#1F2937",
                  letterSpacing: "0.02em"
                }}
              >
                CURVA DE AVANCE (S-CURVE) - PLAN VS REAL
              </h2>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={planVsRealData}>
                  <defs>
                    <linearGradient id="colorPlan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fontFamily: 'Georgia, "Times New Roman", serif' }}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: 'Georgia, "Times New Roman", serif' }}
                    stroke="#9CA3AF"
                    label={{
                      value: "% Avance",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontFamily: "Arial, sans-serif", fontWeight: 700 }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      fontFamily: 'Georgia, "Times New Roman", serif'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "Arial, sans-serif", fontWeight: 700 }} />
                  <Area type="monotone" dataKey="planificado" stroke="#3B82F6" strokeWidth={3} fill="url(#colorPlan)" name="Planificado" />
                  <Area type="monotone" dataKey="real" stroke="#10B981" strokeWidth={3} fill="url(#colorReal)" name="Real" connectNulls={false} />
                  <Area type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorForecast)" name="Forecast" connectNulls={false} />
                </AreaChart>
              </ResponsiveContainer>

              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#FEF2F2",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  color: "#7F1D1D",
                  borderLeft: "6px solid #F9423A",
                  fontFamily: 'Georgia, "Times New Roman", serif'
                }}
              >
                <strong style={{ fontFamily: "Arial, sans-serif", fontWeight: 900 }}>⚠️ ALERTA CRÍTICA:</strong> El proyecto está 18 puntos porcentuales por debajo del plan. Con el forecast actual, se proyecta terminar el <strong style={{ fontFamily: "Arial, sans-serif" }}>25 de Mayo 2027</strong> (49 días de atraso vs baseline 6 Abr 2027). <strong style={{ fontFamily: "Arial, sans-serif" }}>SPI = 0.68</strong> (bajo 0.8 = crítico).
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                padding: "2rem",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
            >
              <h2
                style={{
                  margin: "0 0 1.5rem 0",
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  fontFamily: '"Arial Black", Arial, sans-serif',
                  color: "#1F2937",
                  letterSpacing: "0.02em"
                }}
              >
                FASES CRÍTICAS - PLAN VS REAL
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={phaseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fontFamily: 'Georgia, "Times New Roman", serif' }}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: 'Georgia, "Times New Roman", serif' }}
                    stroke="#9CA3AF"
                    label={{
                      value: "% Avance",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontFamily: "Arial, sans-serif", fontWeight: 700 }
                    }}
                  />
                  <Tooltip contentStyle={{ fontFamily: 'Georgia, "Times New Roman", serif' }} />
                  <Legend wrapperStyle={{ fontFamily: "Arial, sans-serif", fontWeight: 700 }} />
                  <Bar dataKey="planificado" fill="#3B82F6" name="Planificado" />
                  <Bar dataKey="real" fill="#F9423A" name="Real" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                padding: "2rem",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    fontFamily: '"Arial Black", Arial, sans-serif',
                    color: "#1F2937",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    letterSpacing: "0.02em"
                  }}
                >
                  <XCircle size={24} color="#F9423A" />
                  ACTIVIDADES VENCIDAS
                </h2>
                <div
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#FEE2E2",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: 900,
                    color: "#F9423A",
                    fontFamily: '"Arial Black", Arial, sans-serif'
                  }}
                >
                  {activitiesOverdue.length} TAREAS VENCIDAS
                </div>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                {activitiesOverdue.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      background: "#FEF2F2",
                      padding: "1.25rem",
                      borderRadius: "8px",
                      borderLeft: `6px solid ${activity.isCritical ? "#F9423A" : "#F59E0B"}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", gap: "1rem" }}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#7F1D1D",
                            fontWeight: 900,
                            marginBottom: "0.25rem",
                            fontFamily: '"Arial Black", Arial, sans-serif'
                          }}
                        >
                          {activity.phaseCode} · {activity.isCritical ? "🔴 CRÍTICA" : "⚠️ NORMAL"}
                        </div>
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#7F1D1D",
                            marginBottom: "0.5rem",
                            fontFamily: "Arial, sans-serif"
                          }}
                        >
                          {activity.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#991B1B",
                            fontFamily: 'Georgia, "Times New Roman", serif'
                          }}
                        >
                          Responsable: {activity.responsible}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            padding: "0.5rem 0.875rem",
                            background: "#F9423A",
                            color: "#FFFFFF",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            fontWeight: 900,
                            fontFamily: '"Arial Black", Arial, sans-serif',
                            marginBottom: "0.5rem"
                          }}
                        >
                          +{activity.daysOverdue} DÍAS
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#991B1B",
                            fontFamily: 'Georgia, "Times New Roman", serif'
                          }}
                        >
                          {activity.progressPct}% avance
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "0.75rem",
                        background: "#FFFFFF",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        color: "#374151",
                        display: "flex",
                        alignItems: "start",
                        gap: "0.5rem",
                        fontFamily: 'Georgia, "Times New Roman", serif'
                      }}
                    >
                      <Ban size={16} color="#F9423A" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <span style={{ fontWeight: 700, fontFamily: "Arial, sans-serif" }}>Blocker:</span> {activity.blocker}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "lookahead" && (
          <div style={{ padding: "3rem", background: "#FFF", borderRadius: "12px", textAlign: "center" }}>
            <Calendar size={64} color="#F9423A" style={{ margin: "0 auto 1rem" }} />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                marginBottom: "1rem",
                color: "#1F2937",
                fontFamily: '"Arial Black", Arial, sans-serif'
              }}
            >
              LOOKAHEAD 15 DÍAS
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6B7280",
                marginBottom: "1.5rem",
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
            >
              Próximas actividades críticas con restricciones a liberar
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "#FEF2F2",
                borderRadius: "8px",
                border: "3px solid #F9423A",
                fontSize: "0.95rem",
                color: "#7F1D1D",
                fontWeight: 700,
                fontFamily: "Arial, sans-serif"
              }}
            >
              9 restricciones críticas pendientes
            </div>
          </div>
        )}

        {activeTab === "criticos" && (
          <div style={{ padding: "3rem", background: "#FFF", borderRadius: "12px", textAlign: "center" }}>
            <AlertTriangle size={64} color="#F9423A" style={{ margin: "0 auto 1rem" }} />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                marginBottom: "1rem",
                color: "#1F2937",
                fontFamily: '"Arial Black", Arial, sans-serif'
              }}
            >
              RUTA CRÍTICA
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6B7280",
                marginBottom: "1.5rem",
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
            >
              {phases.filter((p) => p.isCritical).length} fases en ruta crítica determinan la fecha de término
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "#FEF2F2",
                borderRadius: "8px",
                border: "3px solid #F9423A",
                fontSize: "0.95rem",
                color: "#7F1D1D",
                fontWeight: 700,
                fontFamily: "Arial, sans-serif"
              }}
            >
              Cualquier retraso adicional en estas fases retrasa el proyecto completo
            </div>
          </div>
        )}

        {activeTab === "hitos" && (
          <div style={{ padding: "3rem", background: "#FFF", borderRadius: "12px", textAlign: "center" }}>
            <CheckCircle2 size={64} color="#10B981" style={{ margin: "0 auto 1rem" }} />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                marginBottom: "1rem",
                color: "#1F2937",
                fontFamily: '"Arial Black", Arial, sans-serif'
              }}
            >
              HITOS CONTRACTUALES
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6B7280",
                marginBottom: "1.5rem",
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
            >
              7 hitos totales · 1 cumplido · 5 en riesgo
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "#FEF2F2",
                borderRadius: "8px",
                border: "3px solid #F9423A",
                fontSize: "0.95rem",
                color: "#7F1D1D",
                fontWeight: 700,
                fontFamily: "Arial, sans-serif"
              }}
            >
              Exposición a penalidades: $147k USD
            </div>
          </div>
        )}

        {activeTab === "impacto" && (
          <div style={{ padding: "3rem", background: "#FFF", borderRadius: "12px", textAlign: "center" }}>
            <DollarSign size={64} color="#F9423A" style={{ margin: "0 auto 1rem" }} />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                marginBottom: "1rem",
                color: "#1F2937",
                fontFamily: '"Arial Black", Arial, sans-serif'
              }}
            >
              IMPACTO EN NEGOCIO
            </h2>
            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                color: "#F9423A",
                marginBottom: "1rem",
                fontFamily: '"Arial Black", Arial, sans-serif',
                letterSpacing: "-0.02em"
              }}
            >
              $1.27M USD
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#7F1D1D",
                fontWeight: 700,
                marginBottom: "2rem",
                fontFamily: "Arial, sans-serif"
              }}
            >
              Impacto financiero total del atraso de 49 días
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                textAlign: "left",
                maxWidth: "800px",
                margin: "0 auto"
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  background: "#FEF2F2",
                  borderRadius: "8px",
                  border: "3px solid #F9423A"
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#7F1D1D",
                    marginBottom: "0.5rem",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700
                  }}
                >
                  Retraso de Cobros
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#F9423A",
                    fontFamily: '"Arial Black", Arial, sans-serif'
                  }}
                >
                  $980k
                </div>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  background: "#FEF3C7",
                  borderRadius: "8px",
                  border: "3px solid #F59E0B"
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#92400E",
                    marginBottom: "0.5rem",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700
                  }}
                >
                  Sobre-gasto
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#D97706",
                    fontFamily: '"Arial Black", Arial, sans-serif'
                  }}
                >
                  $290k
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
