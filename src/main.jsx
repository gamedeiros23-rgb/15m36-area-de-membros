import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Check,
  ChevronRight,
  House,
  LayoutGrid,
  CalendarDays,
  Utensils,
  Menu,
  X,
  Clock,
  Play,
  Leaf,
  Droplets,
  Flame,
  LockKeyhole,
  BookOpen,
  Info,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import {
  modules,
  phases,
  allLessons,
  schedule,
  scheduleIsDemonstration,
  workouts,
  complementaryLessons,
  recipes,
  materials,
  entitlements,
} from "./data";
import Hydration from "./Hydration";
import { Progress, Journey, Workouts } from "./Journey";
import "./style.css";
import "./theme.css";
const KEY = "15m36-progress-v1";
function readProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(p)
      ? [...new Set(p)].filter((id) => allLessons.some((l) => l.id === id))
      : [];
  } catch {
    return [];
  }
}
function getRoute() {
  const hash = window.location.hash.slice(1);
  return hash || "home";
}
function App() {
  const [route, setRoute] = useState(getRoute),
    [menu, setMenu] = useState(false),
    [done, setDone] = useState(readProgress),
    [storageError, setStorageError] = useState(false),
    [day, setDay] = useState(1),
    [meal, setMeal] = useState("Todas"),
    [method, setMethod] = useState("Todos"),
    [recipe, setRecipe] = useState(null);
  useEffect(() => {
    const f = () => {
      setRoute(getRoute());
      setMenu(false);
      setRecipe(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(done));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [done]);
  useEffect(() => {
    if (!recipe) return;
    const old = document.activeElement;
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    dialog.querySelector("button").focus();
    return () => {
      dialog.close();
      old?.focus();
    };
  }, [recipe]);
  const navigate = (r) => {
    if (getRoute() === r) {
      setMenu(false);
      window.scrollTo(0, 0);
    } else window.location.hash = r;
  };
  const toggle = (id) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const next = complementaryLessons.find((l) => !done.includes(l.id));
  const nextWorkout = workouts.find((l) => !done.includes(l.id));
  const currentPhase = phases[nextWorkout?.phase ?? 2];
  const currentLesson = route.startsWith("lesson/")
    ? allLessons.find((l) => l.id === route.split("/")[1])
    : null;
  const currentModule = route.startsWith("module/")
    ? modules.find((m) => m.id === Number(route.split("/")[1]))
    : currentLesson
      ? modules.find((m) => m.id === currentLesson.moduleId)
      : null;
  const goNext = () =>
    navigate(nextWorkout ? `lesson/${nextWorkout.id}` : "workouts");
  const continueLessons = () =>
    navigate(next ? `lesson/${next.id}` : "modules");
  const nav = [
    { id: "home", label: "Visão geral", icon: House },
    { id: "workouts", label: "Treinos", icon: Flame },
    { id: "food", label: "Alimentação", icon: Utensils },
    { id: "hydration", label: "Hidratação", icon: Droplets },
    { id: "modules", label: "Meus módulos", icon: LayoutGrid },
    { id: "calendar", label: "Meu calendário", icon: CalendarDays },
  ];
  const progress = <Progress done={done} compact />;
  const moduleCards = () => (
    <div className="module-grid">
      {modules.map((m, i) => (
        <button
          key={m.id}
          className="module-card"
          onClick={() => navigate(`module/${m.id}`)}
        >
          <div className={`module-cover cover-${i}`}>
            <div className="cover-top">
              <span>TEAM MEDEIROS</span>
              <ArrowRight size={12} />
            </div>
            <span className="cover-kicker">
              {i === 0
                ? "SEU DESAFIO COMEÇA AQUI"
                : i === 1
                  ? "SUPER BÔNUS"
                  : `SISTEMA EVO3 · FASE 0${i - 1}`}
            </span>
            <strong>
              {
                [
                  "Comece\naqui.",
                  "Comer\nbem.",
                  "Ativar.",
                  "Acelerar.",
                  "Evoluir.",
                ][i]
              }
            </strong>
            <span className="cover-bottom">
              {i < 2
                ? "MÉTODO GABRIEL MEDEIROS"
                : `DIAS ${phases[i - 2].days.toUpperCase()}`}
            </span>
            <div className="cover-art" aria-hidden="true" />
          </div>
          <div className="module-meta">
            <span>MÓDULO {String(m.id).padStart(2, "0")}</span>
            {done.filter((id) => m.lessons.some((l) => l.id === id)).length ===
            m.lessons.length ? (
              <CheckCircle2 size={15} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>
          <h3>{m.name}</h3>
          <p>
            {m.lessons.length} {m.lessons.length === 1 ? "aula" : "aulas"}
            {i > 1 ? " · 3 treinos de 15 min" : ""}
          </p>
        </button>
      ))}
    </div>
  );
  const calendar = (compact = false) => {
    const selected = schedule[day - 1],
      phase = phases[selected.phase],
      suggested = workouts.find((l) => l.id === selected.workoutId);
    return (
      <section className="calendar-content">
        <div className="calendar-demo">
          <Info size={17} />
          <p>
            {scheduleIsDemonstration
              ? "PROGRAMAÇÃO DEMONSTRATIVA — dias exatos a confirmar pelo Gabriel."
              : "PROGRAMAÇÃO APROVADA"}
            <span>
              3 treinos por semana. Os demais dias indicam recuperação,
              alimentação e hidratação.
            </span>
          </p>
        </div>
        <div className="phase-legend">
          {phases.map((p, i) => (
            <span key={p.name}>
              <i className={`dot phase-${i}`} />
              <b>{p.name.toUpperCase()}</b> · dias {p.days}
            </span>
          ))}
        </div>
        <div className="days">
          {schedule.map((d) => (
            <button
              aria-label={`Dia ${d.day}, ${phases[d.phase].name}`}
              aria-pressed={day === d.day}
              className={`day phase-${d.phase} ${d.type} ${day === d.day ? "selected" : ""}`}
              key={d.day}
              onClick={() => setDay(d.day)}
            >
              <small>DIA</small>
              <strong>{String(d.day).padStart(2, "0")}</strong>
              <span className="day-type">
                {d.type === "training" ? "TREINO" : "RECUP."}
              </span>
              {d.closing && <span className="closing-dot" />}
            </button>
          ))}
        </div>
        <div className="day-detail">
          <div>
            <span className="eyebrow">
              DIA {day} · {phase.level} ·{" "}
              {scheduleIsDemonstration ? "DEMONSTRAÇÃO" : "PROGRAMAÇÃO"}
            </span>
            <h3>
              {phase.name.toUpperCase()} ·{" "}
              {selected.type === "training"
                ? "Dia de treino"
                : "Dia de recuperação"}
            </h3>
            <p>
              {suggested
                ? `Sugestão demonstrativa: ${suggested.title}. Você pode acessar os três treinos da fase.`
                : "Sem treino sugerido neste dia demonstrativo. Mantenha os hábitos de alimentação e hidratação."}
            </p>
            {selected.type === "recovery" && (
              <div className="habit-links">
                <button
                  className="text-button"
                  onClick={() => navigate("food")}
                >
                  Alimentação
                  <ArrowRight size={14} />
                </button>
                <button
                  className="text-button"
                  onClick={() => navigate("hydration")}
                >
                  Hidratação
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="day-actions">
            <span className="eyebrow">TREINOS DISPONÍVEIS NA FASE</span>
            {modules[selected.phase + 2].lessons
              .filter((l) => l.workout || day === 21)
              .map((l) => (
                <button
                  className={`text-button ${suggested?.id === l.id ? "suggested" : ""}`}
                  key={l.id}
                  onClick={() => navigate(`lesson/${l.id}`)}
                >
                  {l.title}
                  <ArrowRight size={15} />
                </button>
              ))}
          </div>
        </div>
        {!compact && (
          <div className="notice">
            <Info size={18} />
            <p>
              Inclua recuperação na programação e mantenha os hábitos de
              alimentação e hidratação. Concluir vídeos não comprova a
              realização dos 21 dias. Nenhum módulo é bloqueado por data.
            </p>
          </div>
        )}
      </section>
    );
  };
  const food = () => (
    <>
      <div className="page-heading">
        <span className="eyebrow">MÓDULO 02 · SUPER BÔNUS</span>
        <h1>Dieta Metabólica</h1>
        <p>
          Comidas Deliciosas para Emagrecer. Mais organização e praticidade à
          mesa.
        </p>
      </div>
      <div className="food-banner">
        <div>
          <span className="eyebrow">COZINHA NA ROTINA</span>
          <h2>
            Comer melhor pode
            <br />
            caber no seu dia.
          </h2>
          <p>Receitas práticas, escolhas possíveis e espaço para sua rotina.</p>
        </div>
        <Utensils size={100} strokeWidth={1} />
      </div>
      <div className="notice">
        <Info size={18} />
        <p>
          As {recipes.length} receitas abaixo são exemplos demonstrativos. Os
          conteúdos definitivos serão fornecidos pelo Gabriel. Não são uma
          prescrição alimentar individual.
        </p>
      </div>
      <section className="section">
        <div className="section-title">
          <h2>Receitas para a rotina</h2>
          <span>
            {
              recipes.filter(
                (r) =>
                  (meal === "Todas" || r.meal === meal) &&
                  (method === "Todos" || r.method === method),
              ).length
            }{" "}
            receitas
          </span>
        </div>
        <div className="filters">
          <label htmlFor="meal-filter">Refeição</label>
          <select
            id="meal-filter"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          >
            {[
              "Todas",
              "Café da manhã",
              "Almoço",
              "Café da tarde",
              "Jantar",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <label htmlFor="method-filter">Modo de preparo</label>
          <select
            id="method-filter"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {[
              "Todos",
              "Fogão",
              "Forno",
              "Air fryer",
              "Liquidificador",
              "Sem cozimento",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="recipe-grid">
          {recipes
            .filter(
              (r) =>
                (meal === "Todas" || r.meal === meal) &&
                (method === "Todos" || r.method === method),
            )
            .map((r) => (
              <button
                className="recipe-card"
                key={r.id}
                onClick={() => setRecipe(r)}
              >
                <div className={`recipe-art ${r.color}`} aria-hidden="true">
                  <span>{r.icon}</span>
                  <i>COZINHA NA ROTINA</i>
                </div>
                <div className="recipe-body">
                  <span className="eyebrow">EXEMPLO · {r.meal}</span>
                  <h3>{r.name}</h3>
                  <p>
                    <Clock size={14} />
                    {r.time} min <span>· {r.method}</span>
                    <ArrowRight size={17} />
                  </p>
                </div>
              </button>
            ))}
        </div>
        {!recipes.some(
          (r) =>
            (meal === "Todas" || r.meal === meal) &&
            (method === "Todos" || r.method === method),
        ) && (
          <div className="empty">
            <Leaf />
            <h3>Nenhuma receita com esses filtros</h3>
            <p>Experimente outra combinação.</p>
            <button
              className="secondary"
              onClick={() => {
                setMeal("Todas");
                setMethod("Todos");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
      <section className="section">
        <h2>Seus materiais de apoio</h2>
        <div className="materials">
          {materials.map((m) => (
            <div className="material" key={m.title}>
              <BookOpen size={20} />
              <div>
                <h3>{m.title}</h3>
                {m.url ? (
                  <a href={m.url} download>
                    Baixar material
                  </a>
                ) : (
                  <p>Material em preparação</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
  const lessonView = () => {
    const l = currentLesson,
      m = currentModule,
      index = allLessons.findIndex((x) => x.id === l.id),
      phase = m.phase !== undefined ? phases[m.phase] : null;
    return (
      <>
        <button className="back" onClick={() => navigate(`module/${m.id}`)}>
          <ArrowLeft size={16} />
          Voltar ao módulo {String(m.id).padStart(2, "0")}
        </button>
        <div className="lesson-layout">
          <div>
            {l.videoUrl ? (
              <video
                className="real-video"
                controls
                preload="metadata"
                src={l.videoUrl}
                poster={l.coverUrl || undefined}
                aria-label={l.title}
              />
            ) : (
              <div className="video-cover">
                <span className="eyebrow">
                  TEAM MEDEIROS · MÉTODO GABRIEL MEDEIROS
                </span>
                <div className="video-center">
                  <div className="video-icon">
                    <Play size={30} />
                  </div>
                  <h2>{l.workout ? phase.name : "15M36"}</h2>
                  <p>Vídeo será inserido</p>
                </div>
                <span className="video-caption">{l.title}</span>
              </div>
            )}
            <div className="lesson-title">
              <div>
                <span className="eyebrow">
                  MÓDULO {String(m.id).padStart(2, "0")}
                  {phase ? ` · ${phase.level}` : ""}
                </span>
                <h1>{l.title}</h1>
              </div>
            </div>
            {l.workout ? (
              <>
                <div className="workout-stats">
                  <div>
                    <Clock />
                    <b>15 minutos</b>
                    <small>Duração planejada</small>
                  </div>
                  <div>
                    <Flame />
                    <b>
                      {phase.work}s / {phase.rest}s
                    </b>
                    <small>Execução / descanso</small>
                  </div>
                  <div>
                    <LayoutGrid />
                    <b>5 × 3</b>
                    <small>Exercícios × rodadas</small>
                  </div>
                </div>
                <h2>Sobre este treino</h2>
                <p className="body-copy">
                  Dias {phase.days} · {phase.description} Cada bloco completo de
                  execução e descanso soma um minuto. São cinco exercícios em
                  três rodadas: 15 minutos.
                </p>
                <div className="exercise-list">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <p>
                        Exercício {i + 1}
                        <small>
                          Conteúdo demonstrativo · movimento e adaptação a
                          definir pelo Gabriel
                        </small>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="lesson-copy">
                <h2>Seu próximo passo</h2>
                <p>
                  {l.id === "intro-1"
                    ? "Bem-vinda ao seu desafio. Este é um espaço para construir uma rotina possível, um passo de cada vez. A mensagem de boas-vindas do Gabriel será inserida aqui."
                    : l.id === "intro-2"
                      ? "O desafio tem 21 dias, três fases e nove treinos principais. Os vídeos podem ser revisitados. São três treinos por semana, com dias exatos a confirmar pelo Gabriel; a entrega oficial será pela Hotmart."
                      : l.id === "intro-3"
                        ? "O Sistema EVO3 tem três fases: ATIVAR (dias 1 a 7), ACELERAR (dias 8 a 14) e EVOLUIR (dias 15 a 21), com três treinos em cada fase. No conceito 15M36, as 36 horas remetem às respostas pós-treino, incluindo recuperação e adaptação. Não são uma promessa de queima acelerada de gordura por um período exato."
                        : l.id === "intro-4"
                          ? "Os três pilares são treino HIIT de 15 minutos com progressão EVO3, refeições práticas e organização alimentar para facilitar o déficit calórico, e uma meta individual de hidratação."
                          : l.id === "intro-5"
                            ? "Sua necessidade de água é individual. Na área de Hidratação, informe sua própria meta com orientação adequada e registre o consumo diário. Não há meta universal ou cálculo automático de prescrição."
                            : l.id === "intro-6"
                              ? "Comece respeitando seus limites e siga as adaptações orientadas. Interrompa o exercício em caso de dor ou mal-estar. As orientações definitivas serão fornecidas pelo Gabriel."
                              : l.id === "food-1"
                                ? "O bônus reúne roteiro alimentar, receitas, substituições e organização de refeições. Explore os exemplos demonstrativos e os espaços reservados para os materiais finais."
                                : "Dia 21: espaço reservado para a mensagem final do Gabriel e orientações de continuidade. Concluir esta aula não registra automaticamente os 21 dias de prática."}
                </p>
                {l.id === "intro-5" && (
                  <button
                    className="secondary"
                    onClick={() => navigate("hydration")}
                  >
                    Abrir minha hidratação
                    <ArrowRight size={16} />
                  </button>
                )}
                {l.id === "food-1" && (
                  <button
                    className="secondary"
                    onClick={() => navigate("food")}
                  >
                    Explorar bônus alimentar
                    <ArrowRight size={16} />
                  </button>
                )}
                {m.id === 1 && (
                  <div className="material">
                    <BookOpen size={22} />
                    <div>
                      <h3>Folha de controle dos hábitos</h3>
                      <p>Material em preparação</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {l.workout && (
              <div className="notice">
                <Info size={18} />
                <p>
                  Respeite seus limites, siga as adaptações e interrompa o
                  exercício em caso de dor ou mal-estar. Orientações específicas
                  serão inseridas com o conteúdo definitivo.
                </p>
              </div>
            )}
            <div className="completion">
              <button
                className={
                  done.includes(l.id) ? "secondary completed" : "primary"
                }
                onClick={() => toggle(l.id)}
              >
                <Check size={18} />
                {done.includes(l.id)
                  ? "Concluída · Desfazer"
                  : "Marcar como concluído"}
              </button>
              <span>
                {l.workout
                  ? "Conclusão de treino"
                  : "Conclusão de aula complementar"}{" "}
                salva neste navegador.
              </span>
            </div>
            <div className="lesson-pagination">
              <button
                disabled={index === 0}
                onClick={() => navigate(`lesson/${allLessons[index - 1].id}`)}
              >
                <ChevronLeft size={18} />
                Aula anterior
              </button>
              <button
                disabled={index === allLessons.length - 1}
                onClick={() => navigate(`lesson/${allLessons[index + 1].id}`)}
              >
                Próxima aula
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <aside className="lesson-sidebar">
            <span className="eyebrow">NESTE MÓDULO</span>
            <h3>{m.name}</h3>
            {m.lessons.map((item, i) => (
              <button
                key={item.id}
                className={item.id === l.id ? "active" : ""}
                onClick={() => navigate(`lesson/${item.id}`)}
              >
                {done.includes(item.id) ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <span className="lesson-number">{i + 1}</span>
                )}
                <span>
                  {item.title}
                  <small>
                    {item.workout
                      ? "15 min · Treino gravado"
                      : "Aula · Conteúdo em preparação"}
                  </small>
                </span>
              </button>
            ))}
          </aside>
        </div>
      </>
    );
  };
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("main").focus();
        }}
      >
        Pular para o conteúdo
      </a>
      {menu && (
        <button
          className="menu-overlay"
          aria-label="Fechar menu"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <button
          className="brand"
          aria-label="Voltar à página inicial"
          onClick={() => navigate("home")}
        >
          <span className="brand-mark">
            M<ArrowUpRight className="brand-arrow" aria-hidden="true" />
          </span>
          <span>
            TEAM
            <br />
            <b>MEDEIROS</b>
          </span>
        </button>
        <button
          className="close-menu"
          aria-label="Fechar menu"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <div className="course-label">SUA ÁREA DE MEMBROS</div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              className={
                route === n.id ||
                (n.id === "modules" && (currentModule || currentLesson))
                  ? "active"
                  : ""
              }
            >
              <n.icon size={19} />
              {n.label}
              {n.id === "food" && <span className="nav-tag">INCLUSO</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-progress">{progress}</div>
        <div className="sidebar-bottom">
          <div className="evo-logo">
            EVO<span>3</span>
          </div>
          <p>
            ENTRE EM AÇÃO.
            <br />
            EVOLUA NO SEU RITMO.
          </p>
          <span>MÉTODO GABRIEL MEDEIROS</span>
        </div>
      </aside>
      <div className="app-content">
        <header className="topbar">
          <div>
            <button
              className="mobile-menu"
              aria-label="Abrir menu"
              aria-expanded={menu}
              onClick={() => setMenu(true)}
            >
              <Menu />
            </button>
            <span>
              DESAFIO <b>15M36</b>
            </span>
            <span className="top-divider" />
            <span className="top-subtitle">Método Gabriel Medeiros</span>
          </div>
          <span className="demo-badge">
            <i />
            Protótipo navegável
          </span>
        </header>
        <main id="main-content" tabIndex={-1}>
          {storageError && (
            <div className="notice" role="alert">
              O navegador não permitiu salvar o progresso. As marcações
              permanecem apenas nesta visita.
            </div>
          )}
          {route === "home" ? (
            <>
              <div className="welcome">
                <div>
                  <span className="eyebrow">
                    DESAFIO 15M36 · MÉTODO GABRIEL MEDEIROS
                  </span>
                  <p>Seu plano de ação está aqui. Vamos ao próximo passo.</p>
                </div>
                <span className="welcome-label">
                  <span className="dot" /> 21 DIAS · SISTEMA EVO3
                </span>
              </div>
              <section className="hero">
                <div className="hero-content">
                  <span className="hero-label">
                    TREINOS EM CASA. FOCO NA SUA ROTINA.
                  </span>
                  <h1>
                    SEU DESAFIO DE 21 DIAS <em>COMEÇA AGORA.</em>
                  </h1>
                  <p>
                    Treinos progressivos, alimentação e hidratação. Um plano
                    organizado para você entrar em ação e buscar menos medidas.
                  </p>
                  <button className="lime-button" onClick={goNext}>
                    {nextWorkout
                      ? "CONTINUAR MEU DESAFIO"
                      : "REVISAR MEUS TREINOS"}
                    <ArrowRight size={18} />
                  </button>
                  <div className="hero-foot">
                    <Flame size={15} />
                    <span>
                      Fase atual na sequência:{" "}
                      <b>{currentPhase.name.toUpperCase()}</b>
                      {!nextWorkout ? " · Treinos concluídos" : ""}
                    </span>
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="orbit orbit-three" />
                  <div className="hero-numbers">
                    15<span>M36</span>
                  </div>
                  <span className="art-caption">
                    ATIVAR. ACELERAR. EVOLUIR.
                  </span>
                  <span className="art-plus">+</span>
                </div>
              </section>
              <div className="overview-stats">
                {[
                  ["21", "dias de desafio"],
                  ["9", "treinos de 15 minutos"],
                  ["3", "treinos por semana"],
                  ["3", "fases do Sistema EVO3"],
                ].map(([v, t], i) => (
                  <div key={i}>
                    <strong>{v}</strong>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <Journey done={done} navigate={navigate} />
              <div className="intro-shortcut">
                <BookOpen size={19} />
                <div>
                  <h3>Comece com orientação, sem complicar.</h3>
                  <p>
                    Conheça o método e as adaptações antes de entrar em ação.
                  </p>
                </div>
                <button className="text-button" onClick={continueLessons}>
                  {next
                    ? "Continuar aulas complementares"
                    : "Revisar aulas complementares"}
                  <ArrowRight size={16} />
                </button>
              </div>
              <section className="section">
                <div className="section-title">
                  <div>
                    <span className="eyebrow">UM CAMINHO, CINCO ETAPAS</span>
                    <h2>Seu desafio, por dentro</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => navigate("modules")}
                  >
                    Ver todos os módulos
                    <ArrowRight size={16} />
                  </button>
                </div>
                {moduleCards()}
              </section>
              <section className="pillars section">
                <div>
                  <span className="eyebrow">TRÊS PILARES. UM PLANO.</span>
                  <h2>
                    Entre em ação.
                    <br />
                    Construa sua rotina.
                  </h2>
                  <p>
                    Treino, alimentação e hidratação. Também nos dias de
                    recuperação.
                  </p>
                </div>
                {[
                  [
                    Flame,
                    "TREINOS",
                    "9 treinos de 15 minutos, com progressão EVO3.",
                    "workouts",
                    "Ir para os treinos",
                  ],
                  [
                    Leaf,
                    "ALIMENTAÇÃO",
                    "Dieta Metabólica: seu Super Bônus incluso.",
                    "food",
                    "Explorar alimentação",
                  ],
                  [
                    Droplets,
                    "HIDRATAÇÃO",
                    "Informe sua meta individual e registre seu consumo.",
                    "hydration",
                    "Acompanhar hidratação",
                  ],
                ].map(([Icon, title, copy, target, action]) => (
                  <article key={title}>
                    <span className="pillar-icon">
                      <Icon />
                    </span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <button
                      className="text-button"
                      onClick={() => navigate(target)}
                    >
                      {action}
                      <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </section>
              <section className="concept-strip">
                <span className="concept-number">
                  15<span>M36</span>
                </span>
                <div>
                  <span className="eyebrow">
                    O TREINO TERMINA. A ADAPTAÇÃO CONTINUA.
                  </span>
                  <h2>Movimento, recuperação e evolução.</h2>
                  <p>
                    As 36 horas representam o conceito de respostas pós-treino,
                    incluindo recuperação e adaptação. Não garantem um período
                    exato de queima acelerada de gordura ou resultados de
                    emagrecimento.
                  </p>
                </div>
              </section>
              <section className="section calendar-section">
                <div className="section-title">
                  <div>
                    <span className="eyebrow">CONHEÇA O CAMINHO</span>
                    <h2>21 dias, um passo de cada vez</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => navigate("calendar")}
                  >
                    Abrir calendário
                    <ArrowRight size={16} />
                  </button>
                </div>
                {calendar(true)}
                <p className="muted calendar-note">
                  Treinos concluídos não são dias de desafio cumpridos. A
                  distribuição de treino e recuperação acima é demonstrativa.
                </p>
              </section>
            </>
          ) : route === "modules" ? (
            <>
              <div className="page-heading">
                <span className="eyebrow">SUA JORNADA</span>
                <h1>Meus módulos</h1>
                <p>
                  Cinco etapas para conhecer o método e avançar no seu ritmo.
                </p>
              </div>
              {moduleCards()}
              <section className="section">
                <h2>Adicionais vendidos separadamente</h2>
                <p className="body-copy">
                  Não fazem parte dos cinco módulos inclusos. Nenhuma compra é
                  realizada nesta demonstração.
                </p>
                <div className="extras">
                  {[
                    [
                      "Método Corpo sem Dor",
                      "Material complementar de mobilidade e adaptações para desconfortos em joelhos e costas, sem promessa de tratamento ou cura.",
                      entitlements.corpoSemDor,
                    ],
                    [
                      "Acesso Vitalício",
                      "Condições e atualizações ainda a definir. O prazo de acesso padrão também não está definido.",
                      entitlements.acessoVitalicio,
                    ],
                  ].map(([title, copy, access]) => (
                    <article key={title}>
                      <LockKeyhole size={22} />
                      <h3>{title}</h3>
                      <p>{copy}</p>
                      <span className="badge">
                        {access
                          ? "Direito registrado"
                          : "Não incluído no acesso demonstrativo"}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : route === "calendar" ? (
            <>
              <div className="page-heading">
                <span className="eyebrow">SISTEMA EVO3</span>
                <h1>Seu calendário de 21 dias</h1>
                <p>
                  Três treinos por semana. Explore os dias de treino e
                  recuperação na programação demonstrativa.
                </p>
              </div>
              {calendar()}
              <div className="phase-cards">
                {phases.map((p, i) => (
                  <article key={p.name}>
                    <span className="eyebrow">
                      FASE 0{i + 1} · DIAS {p.days}
                    </span>
                    <h2>{p.name.toUpperCase()}</h2>
                    <span className="badge">{p.level}</span>
                    <p>{p.description}</p>
                    <b>
                      3 treinos · {p.work}s execução · {p.rest}s descanso
                    </b>
                  </article>
                ))}
              </div>
            </>
          ) : route === "workouts" ? (
            <Workouts done={done} navigate={navigate} />
          ) : route === "hydration" ? (
            <Hydration />
          ) : route === "food" ? (
            food()
          ) : currentLesson ? (
            lessonView()
          ) : currentModule ? (
            <>
              <button className="back" onClick={() => navigate("modules")}>
                <ArrowLeft size={16} />
                Todos os módulos
              </button>
              <div className="page-heading">
                <span className="eyebrow">
                  MÓDULO {String(currentModule.id).padStart(2, "0")} ·{" "}
                  {currentModule.tag}
                </span>
                <h1>{currentModule.name}</h1>
                <p>{currentModule.description}</p>
              </div>
              {currentModule.phase !== undefined && (
                <div className="notice">
                  <Info size={18} />
                  <p>
                    Dias {phases[currentModule.phase].days} ·{" "}
                    {phases[currentModule.phase].level} ·{" "}
                    {phases[currentModule.phase].work}s execução /{" "}
                    {phases[currentModule.phase].rest}s descanso. Reassista sem
                    duplicar seu progresso.
                  </p>
                </div>
              )}
              <div className="module-lessons">
                {currentModule.lessons.map((l, i) => (
                  <button key={l.id} onClick={() => navigate(`lesson/${l.id}`)}>
                    <span className="module-lesson-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <h3>{l.title}</h3>
                      <small>
                        {l.workout
                          ? "15 minutos planejados · 5 exercícios · 3 rodadas"
                          : "Vídeo será inserido"}
                      </small>
                    </span>
                    <span
                      className={`lesson-state ${done.includes(l.id) ? "is-done" : ""}`}
                    >
                      {done.includes(l.id) ? (
                        <>
                          <Check size={16} />
                          Concluída
                        </>
                      ) : (
                        "Disponível"
                      )}
                    </span>
                    <ChevronRight size={20} />
                  </button>
                ))}
              </div>
              {currentModule.id === 2 && (
                <button className="primary" onClick={() => navigate("food")}>
                  Abrir receitas e materiais
                  <ArrowRight size={18} />
                </button>
              )}
            </>
          ) : (
            <div className="empty">
              <h1>Página não encontrada</h1>
              <button className="primary" onClick={() => navigate("home")}>
                Voltar à página inicial
              </button>
            </div>
          )}
          <footer>
            <span>
              TEAM MEDEIROS <i>·</i> Método Gabriel Medeiros
            </span>
            <span>Demonstração · Entrega oficial na Hotmart</span>
          </footer>
        </main>
      </div>
      {recipe && (
        <dialog
          className="recipe-dialog"
          onCancel={(e) => {
            e.preventDefault();
            setRecipe(null);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setRecipe(null);
          }}
          aria-labelledby="recipe-title"
        >
          <button
            className="dialog-close"
            aria-label="Fechar receita"
            onClick={() => setRecipe(null)}
          >
            <X />
          </button>
          <span className="eyebrow">RECEITA DEMONSTRATIVA · {recipe.meal}</span>
          <h2 id="recipe-title">{recipe.name}</h2>
          <p className="recipe-info">
            {recipe.method} · {recipe.time} min · {recipe.yield}
          </p>
          <h3>Ingredientes e quantidades</h3>
          <ul>
            {recipe.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <h3>Passo a passo</h3>
          <ol>
            {recipe.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {[
            ["Utensílios", recipe.utensils],
            ["Temperatura", recipe.temperature],
            ["Substituições", recipe.substitutions],
            ["Sugestão de acompanhamento", recipe.side],
            ["Conservação", recipe.storage],
            ["Alergênicos", recipe.allergens],
          ].map(([label, value]) => (
            <div className="recipe-field" key={label}>
              <h3>{label}</h3>
              <p>{value}</p>
            </div>
          ))}
          <div className="notice">
            <Info size={18} />
            <p>
              Exemplo para demonstrar a ficha. Não possui validação nutricional
              individual.
            </p>
          </div>
        </dialog>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
