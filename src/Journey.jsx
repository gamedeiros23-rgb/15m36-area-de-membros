import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  BookOpen,
} from "lucide-react";
import { workouts, complementaryLessons, modules, phases } from "./data";
export function Progress({ done, compact = false }) {
  return (
    <div className={`progress-groups ${compact ? "compact" : ""}`}>
      {[
        [workouts, "Treinos", "treinos"],
        [complementaryLessons, "Aulas complementares", "aulas complementares"],
      ].map(([items, label, noun]) => {
        const count = items.filter((l) => done.includes(l.id)).length,
          percent = Math.round((count / items.length) * 100);
        return (
          <div className="progress-group" data-progress={noun} key={noun}>
            <div className="progress-label">
              <span>{label}</span>
              <b>{percent}%</b>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={items.length}
              aria-valuenow={count}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <small>
              {count} de {items.length}{" "}
              {noun === "treinos"
                ? "treinos concluídos"
                : "aulas complementares concluídas"}
            </small>
          </div>
        );
      })}
    </div>
  );
}
export function Journey({ done, navigate }) {
  const next = workouts.find((l) => !done.includes(l.id)),
    phase = phases[next?.phase ?? 2];
  return (
    <section className="journey-section">
      <div className="journey-next panel">
        <div className="section-title">
          <span className="eyebrow">
            {next ? "SEU PRÓXIMO TREINO" : "SEQUÊNCIA DE TREINOS CONCLUÍDA"}
          </span>
          <span className="badge">FASE 0{(next?.phase ?? 2) + 1}</span>
        </div>
        <h2>{next ? next.title : "Os nove treinos estão marcados."}</h2>
        <p>
          <Clock size={14} />
          15 min <span>·</span>
          {phase.work}s execução / {phase.rest}s descanso
        </p>
        <button
          className="text-button"
          onClick={() => navigate(next ? `lesson/${next.id}` : "workouts")}
        >
          {next ? "Abrir treino" : "Revisar treinos"}
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="journey-progress panel">
        <div className="section-title">
          <span className="eyebrow">SEU PROGRESSO REAL</span>
          <CheckCircle2 size={20} />
        </div>
        <Progress done={done} />
        <p className="progress-disclaimer">
          Conclusões marcadas por você. Não representam dias de prática nem
          reprodução verificada dos vídeos.
        </p>
      </div>
    </section>
  );
}
export function Workouts({ done, navigate }) {
  const next = workouts.find((l) => !done.includes(l.id));
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">PILAR 01 · SISTEMA EVO3</span>
        <h1>
          Treinos de 15 minutos.
          <br />
          <span className="accent-text">Ação em três fases.</span>
        </h1>
        <p>
          21 dias · 9 treinos principais · 3 treinos por semana. Avance com
          orientação e respeite seus limites.
        </p>
      </div>
      <div className="workouts-summary panel">
        <Progress done={done} />
        <button
          className="primary"
          onClick={() => navigate(next ? `lesson/${next.id}` : "calendar")}
        >
          {next ? "CONTINUAR MEU DESAFIO" : "Consultar calendário"}
          <ArrowRight size={17} />
        </button>
      </div>
      <div className="notice">
        <BookOpen size={18} />
        <div>
          <p>
            Antes de começar, conheça as adaptações e os cuidados de segurança.
          </p>
          <button
            className="text-button"
            onClick={() => navigate("lesson/intro-6")}
          >
            Ver orientação de segurança
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      {phases.map((p, i) => (
        <section
          className={`section workout-phase workout-phase-${i}`}
          key={p.name}
        >
          <div className="section-title">
            <div>
              <span className="eyebrow">
                FASE 0{i + 1} · DIAS {p.days} · {p.level}
              </span>
              <h2>{p.name.toUpperCase()}</h2>
            </div>
            <span className="phase-timing">
              {p.work}s / {p.rest}s
            </span>
          </div>
          <div className="workout-grid">
            {modules[i + 2].lessons
              .filter((l) => l.workout)
              .map((l) => (
                <button
                  key={l.id}
                  className="workout-card"
                  onClick={() => navigate(`lesson/${l.id}`)}
                >
                  <div className="workout-art">
                    <span className="eyebrow">TEAM MEDEIROS · EVO3</span>
                    <strong>{String(l.number).padStart(2, "0")}</strong>
                    <div className="workout-art-bottom">
                      <span>{p.name.toUpperCase()}</span>
                      {done.includes(l.id) ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <Play size={22} />
                      )}
                    </div>
                  </div>
                  <div className="workout-card-body">
                    <h3>{l.title}</h3>
                    <p>
                      <Clock size={14} />
                      15 min planejados
                      <span>
                        {done.includes(l.id) ? "Concluído" : "Disponível"}
                      </span>
                    </p>
                    <small>Vídeo e exercícios em preparação</small>
                  </div>
                </button>
              ))}
          </div>
        </section>
      ))}
      <div className="notice">
        <Flame size={18} />
        <p>
          Treinos gravados em preparação. Concluir um treino contabiliza uma
          única vez. Reassistir não aumenta o progresso. A distribuição dos dias
          no calendário é demonstrativa.
        </p>
      </div>
    </>
  );
}
