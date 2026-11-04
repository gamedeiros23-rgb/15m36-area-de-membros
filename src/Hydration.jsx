import React, { useState, useEffect } from "react";
import { Droplets, Info, RotateCcw, Plus, Check } from "lucide-react";
const KEY = "15m36-hydration-v1";
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function read() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    return {
      goal:
        Number.isFinite(stored?.goal) && stored.goal > 0 ? stored.goal : null,
      date: localDate(),
      entries:
        stored?.date === localDate() && Array.isArray(stored.entries)
          ? stored.entries.filter((v) => Number.isFinite(v) && v > 0)
          : [],
    };
  } catch {
    return { goal: null, date: localDate(), entries: [] };
  }
}
export default function Hydration() {
  const [state, setState] = useState(read),
    [goal, setGoal] = useState(() => state.goal || ""),
    [amount, setAmount] = useState(""),
    [error, setError] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setError(false);
    } catch {
      setError(true);
    }
  }, [state]);
  useEffect(() => {
    const refresh = () =>
      setState((s) =>
        s.date === localDate() ? s : { ...s, date: localDate(), entries: [] },
      );
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const entries = state.date === localDate() ? state.entries : [],
    total = entries.reduce((sum, value) => sum + value, 0),
    percent = state.goal
      ? Math.min(100, Math.round((total / state.goal) * 100))
      : 0;
  const saveGoal = (e) => {
    e.preventDefault();
    const value = Number(goal);
    if (!Number.isFinite(value) || value <= 0) return;
    setState((s) => ({ ...s, goal: value }));
    setMessage("Sua meta foi atualizada.");
  };
  const add = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    setState((s) => ({
      ...s,
      date: localDate(),
      entries: [...(s.date === localDate() ? s.entries : []), value],
    }));
    setAmount("");
    setMessage(`${value} ml registrados.`);
  };
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">PILAR 03 · HÁBITO DIÁRIO</span>
        <h1>Hidratação</h1>
        <p>Treine ou recupere. O cuidado com sua hidratação continua.</p>
      </div>
      <div className="hydration-grid">
        <section className="hydration-status panel">
          <div className="section-title">
            <span className="eyebrow">
              HOJE · {new Date().toLocaleDateString("pt-BR")}
            </span>
            <Droplets size={25} />
          </div>
          <div className="water-total">
            <strong>{total.toLocaleString("pt-BR")}</strong>
            <span>ml registrados por você</span>
          </div>
          <div className="progress-label">
            <span>
              {state.goal
                ? `Sua meta: ${state.goal.toLocaleString("pt-BR")} ml`
                : "Meta ainda não definida"}
            </span>
            <b>{state.goal ? `${percent}%` : "—"}</b>
          </div>
          <div className="progress-track">
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="body-copy">
            {state.goal
              ? total >= state.goal
                ? "Meta informada alcançada. Respeite suas necessidades individuais."
                : "Registre a água que você bebeu hoje."
              : "Informe sua meta individual para acompanhar o progresso. Nenhuma quantidade é prescrita pelo protótipo."}
          </p>
          <form onSubmit={add}>
            <label htmlFor="water-amount">Quantidade consumida (ml)</label>
            <div className="input-action">
              <input
                id="water-amount"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                placeholder="Informe a quantidade"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="primary" type="submit">
                <Plus size={17} />
                Registrar
              </button>
            </div>
          </form>
          <button
            className="text-button"
            disabled={!entries.length}
            onClick={() => {
              setState((s) => ({
                ...s,
                date: localDate(),
                entries: s.date === localDate() ? s.entries.slice(0, -1) : [],
              }));
              setMessage("Último registro desfeito.");
            }}
          >
            <RotateCcw size={14} />
            Desfazer último registro
          </button>
          <div role="status" className="water-message">
            {message}
          </div>
          {error && (
            <p role="alert" className="notice">
              Não foi possível salvar no navegador. Os registros valem apenas
              para esta visita.
            </p>
          )}
        </section>
        <section className="panel hydration-settings">
          <span className="eyebrow">UMA META QUE FAZ SENTIDO PARA VOCÊ</span>
          <h2>Seu corpo, suas necessidades.</h2>
          <p className="body-copy">
            Não existe uma quantidade universal para todas as alunas. Use uma
            meta individual definida com orientação adequada à sua saúde e
            rotina.
          </p>
          <form onSubmit={saveGoal}>
            <label htmlFor="water-goal">Sua meta diária (ml)</label>
            <input
              id="water-goal"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              required
              value={goal}
              placeholder="Informe sua meta individual"
              onChange={(e) => setGoal(e.target.value)}
            />
            <button className="secondary" type="submit">
              <Check size={16} />
              Salvar minha meta
            </button>
          </form>
          <div className="notice">
            <Info size={18} />
            <p>
              Registro manual, salvo somente neste navegador. O consumo começa
              do zero a cada novo dia no horário do seu aparelho; a meta é
              mantida. Não há prescrição automática ou sincronização com a
              Hotmart.
            </p>
          </div>
        </section>
      </div>
      <section className="section hydration-tips">
        <div>
          <span className="eyebrow">MANTENHA O HÁBITO</span>
          <h2>Nos dias de recuperação também.</h2>
          <p className="body-copy">
            Deixe sua água acessível e use este espaço para registrar o que
            consumiu. Alimentação, hidratação e recuperação fazem parte da
            rotina dos 21 dias.
          </p>
        </div>
        <Droplets size={65} strokeWidth={1} />
      </section>
    </>
  );
}
