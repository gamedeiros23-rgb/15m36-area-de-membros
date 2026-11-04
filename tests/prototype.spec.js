import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import {
  modules,
  schedule,
  allLessons,
  workouts,
  complementaryLessons,
  scheduleIsDemonstration,
} from "../src/data.js";
test("estrutura oficial: cinco módulos, nove treinos e calendário demonstrativo de três treinos por semana", () => {
  expect(modules).toHaveLength(5);
  expect(allLessons.filter((l) => l.workout)).toHaveLength(9);
  for (const m of modules.slice(2))
    expect(m.lessons.filter((l) => l.workout)).toHaveLength(3);
  expect(schedule).toHaveLength(21);
  expect(scheduleIsDemonstration).toBeTruthy();
  for (let i = 0; i < 3; i++) {
    const week = schedule.slice(i * 7, i * 7 + 7);
    expect(week.filter((d) => d.type === "training")).toHaveLength(3);
    expect(week.filter((d) => d.type === "recovery")).toHaveLength(4);
    expect(week.every((d) => d.phase === i)).toBeTruthy();
  }
  expect(workouts.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(new Set(allLessons.map((l) => l.id)).size).toBe(17);
  expect(schedule[20].closing).toBeTruthy();
});
test("conclusão, reversão, persistência e próxima aula pendente", async ({
  page,
}) => {
  await page.goto("/area-de-membros");
  await expect(
    page.getByRole("heading", { name: "SEU DESAFIO DE 21 DIAS COMEÇA AGORA." }),
  ).toBeVisible();
  await expect(page.locator(".sidebar-progress")).toContainText("0%");
  await page
    .getByRole("button", { name: "Continuar aulas complementares" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Boas-vindas do Gabriel", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Vídeo será inserido", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Marcar como concluído" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Concluída · Desfazer" }),
  ).toBeVisible();
  await page.goto("/area-de-membros#home");
  await page
    .getByRole("button", { name: "Continuar aulas complementares" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Como funciona o desafio de 21 dias",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/area-de-membros#lesson/intro-1");
  await page.getByRole("button", { name: "Concluída · Desfazer" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Marcar como concluído" }),
  ).toBeVisible();
  await expect(page.locator(".sidebar-progress")).toContainText("0%");
});
test("calendário, treino e encerramento", async ({ page }) => {
  await page.goto("/area-de-membros#calendar");
  await page
    .getByRole("button", { name: "Dia 8, Acelerar", exact: true })
    .click();
  await expect(page.locator(".day-detail")).toContainText("Intermediário");
  await expect(page.locator(".day-actions button")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Treino 04 — ACELERAR A", exact: true })
    .click();
  await expect(page.getByText("40s / 20s", { exact: true })).toBeVisible();
  await expect(page.locator(".exercise-list>div")).toHaveCount(5);
  await expect(page.getByText("15 minutos", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Marcar como concluído" }).click();
  await page.reload();
  await expect(page.locator(".sidebar-progress")).toContainText(
    "1 de 9 treinos concluídos",
  );
  await page.goto("/area-de-membros#calendar");
  await page
    .getByRole("button", { name: "Dia 21, Evoluir", exact: true })
    .click();
  await expect(page.locator(".day-actions button")).toHaveCount(4);
  await expect(page.locator(".day-detail")).toContainText("Encerramento");
});
test("filtros, ficha de receita e arquivos ausentes", async ({ page }) => {
  await page.goto("/area-de-membros#food");
  await expect(page.locator(".recipe-card")).toHaveCount(5);
  await page.getByLabel("Refeição", { exact: true }).selectOption("Almoço");
  await page
    .getByLabel("Modo de preparo", { exact: true })
    .selectOption("Air fryer");
  await expect(page.locator(".recipe-card")).toHaveCount(1);
  await page.getByRole("button", { name: /Legumes na air fryer/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (const title of [
    "Ingredientes e quantidades",
    "Passo a passo",
    "Utensílios",
    "Temperatura",
    "Substituições",
    "Sugestão de acompanhamento",
    "Conservação",
    "Alergênicos",
  ])
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
  await page.getByRole("button", { name: "Fechar receita" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByLabel("Modo de preparo", { exact: true })
    .selectOption("Forno");
  await expect(
    page.getByText("Nenhuma receita com esses filtros"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator(".recipe-card")).toHaveCount(5);
  await expect(page.locator(".material")).toHaveCount(5);
  await expect(
    page.getByText("Material em preparação", { exact: true }),
  ).toHaveCount(5);
});
test("navegação e layout sem cortes", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/area-de-membros");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.locator(".sidebar")).toHaveClass(/open/);
    await page
      .getByRole("button", { name: "Meus módulos", exact: true })
      .click();
    await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  } else
    await page
      .getByRole("button", { name: "Meus módulos", exact: true })
      .click();
  await expect(page.locator(".module-card")).toHaveCount(5);
  await expect(
    page.getByText("Não incluído no acesso demonstrativo", { exact: true }),
  ).toHaveCount(2);
  for (const route of [
    "home",
    "workouts",
    "hydration",
    "modules",
    "calendar",
    "food",
    "module/1",
    "module/2",
    "module/3",
    "module/4",
    "module/5",
    "lesson/workout-6",
  ]) {
    await page.goto(`/area-de-membros#${route}`);
    await expect(page.locator("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.goto("/area-de-membros");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}.png`,
    fullPage: true,
  });
  for (const route of ["workouts", "calendar", "food", "hydration"]) {
    await page.goto(`/area-de-membros#${route}`);
    await page.screenshot({
      path: `artifacts/${testInfo.project.name}-${route}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});
test("prévia HTML independente abre e navega sem rede", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route(/^https?:\/\//, (route) =>
    route.request().isNavigationRequest()
      ? route.fulfill({
          contentType: "text/html",
          body: readFileSync("artifacts/15m36-prototipo.html", "utf8"),
        })
      : route.abort(),
  );
  await page.goto("http://preview.test/");
  await expect(
    page.getByRole("heading", { name: "SEU DESAFIO DE 21 DIAS COMEÇA AGORA." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Continuar aulas complementares" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Boas-vindas do Gabriel", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Marcar como concluído" }).click();
  await expect(
    page.getByRole("button", { name: "Concluída · Desfazer" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("próximo treino direto e progressos separados sem duplicar conclusões", async ({
  page,
}) => {
  await page.goto("/area-de-membros");
  await page
    .getByRole("button", { name: "CONTINUAR MEU DESAFIO", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Treino 01 — ATIVAR A", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Marcar como concluído" }).click();
  await page.goto("/area-de-membros#home");
  await expect(
    page.locator('.journey-progress [data-progress="treinos"]'),
  ).toContainText("1 de 9 treinos concluídos");
  await expect(
    page.locator('.journey-progress [data-progress="aulas complementares"]'),
  ).toContainText("0 de 8 aulas complementares concluídas");
  await page
    .getByRole("button", { name: "CONTINUAR MEU DESAFIO", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Treino 02 — ATIVAR B", exact: true }),
  ).toBeVisible();
  await page.goto("/area-de-membros#lesson/workout-1");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Concluída · Desfazer" }),
  ).toBeVisible();
  await expect(
    page.locator('.sidebar-progress [data-progress="treinos"]'),
  ).toContainText("1 de 9");
  await page.getByRole("button", { name: "Concluída · Desfazer" }).click();
  await expect(
    page.locator('.sidebar-progress [data-progress="treinos"]'),
  ).toContainText("0 de 9");
});
test("conclusões da versão anterior preservam o treino e fase sugerida", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "15m36-progress-v1",
      JSON.stringify([
        "intro-1",
        "workout-1",
        "workout-2",
        "workout-7",
        "workout-3",
      ]),
    ),
  );
  await page.goto("/area-de-membros");
  await expect(
    page.locator('.journey-progress [data-progress="treinos"]'),
  ).toContainText("4 de 9");
  await expect(
    page.locator('.journey-progress [data-progress="aulas complementares"]'),
  ).toContainText("1 de 8");
  await expect(page.locator(".hero-foot")).toContainText("ACELERAR");
  await expect(page.locator(".journey-next")).toContainText(
    "Treino 05 — ACELERAR B",
  );
  await page.goto("/area-de-membros#lesson/workout-3");
  await expect(
    page.getByRole("heading", { name: "Treino 04 — ACELERAR A", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Concluída · Desfazer" }),
  ).toBeVisible();
});
test("cada módulo e página individual mantém acesso e navegação anterior e próxima", async ({
  page,
}) => {
  for (const module of modules) {
    await page.goto(`/area-de-membros#module/${module.id}`);
    await expect(page.locator(".module-lessons>button")).toHaveCount(
      module.lessons.length,
    );
    for (const l of module.lessons) {
      await page
        .getByRole("button", {
          name: new RegExp(l.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        })
        .click();
      await expect(
        page.getByRole("heading", { name: l.title, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Vídeo será inserido", { exact: true }),
      ).toBeVisible();
      await expect(page.locator("video")).toHaveCount(0);
      await page
        .getByRole("button", {
          name: `Voltar ao módulo ${String(module.id).padStart(2, "0")}`,
        })
        .click();
    }
  }
  await page.goto("/area-de-membros#lesson/intro-1");
  await expect(
    page.getByRole("button", { name: "Aula anterior", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Próxima aula", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Como funciona o desafio de 21 dias",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Aula anterior", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Boas-vindas do Gabriel", exact: true }),
  ).toBeVisible();
  await page.goto("/area-de-membros#lesson/closing");
  await expect(
    page.getByRole("button", { name: "Próxima aula", exact: true }),
  ).toBeDisabled();
});
test("dias de recuperação mantêm os hábitos e não viram treino obrigatório", async ({
  page,
}) => {
  await page.goto("/area-de-membros#calendar");
  await expect(page.locator(".calendar-demo")).toContainText(
    "PROGRAMAÇÃO DEMONSTRATIVA",
  );
  await expect(page.locator(".days .training")).toHaveCount(9);
  await expect(page.locator(".days .recovery")).toHaveCount(12);
  await page
    .getByRole("button", { name: "Dia 2, Ativar", exact: true })
    .click();
  await expect(page.locator(".day-detail")).toContainText("Dia de recuperação");
  await expect(page.locator(".day-detail")).toContainText(
    "Sem treino sugerido",
  );
  await page
    .locator(".habit-links")
    .getByRole("button", { name: "Hidratação" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hidratação", exact: true }),
  ).toBeVisible();
});
test("hidratação sem meta imposta, registro, reversão e persistência", async ({
  page,
}) => {
  await page.goto("/area-de-membros#hydration");
  await expect(
    page.getByLabel("Sua meta diária (ml)", { exact: true }),
  ).toHaveValue("");
  await expect(
    page.getByText("Meta ainda não definida", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Sua meta diária (ml)", { exact: true }).fill("1800");
  await page
    .getByRole("button", { name: "Salvar minha meta", exact: true })
    .click();
  await page
    .getByLabel("Quantidade consumida (ml)", { exact: true })
    .fill("300");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await page.reload();
  await expect(page.locator(".water-total strong")).toHaveText("300");
  await expect(
    page.getByLabel("Sua meta diária (ml)", { exact: true }),
  ).toHaveValue("1800");
  await expect(page.locator(".hydration-status .progress-label")).toContainText(
    "17%",
  );
  await page
    .getByRole("button", { name: "Desfazer último registro", exact: true })
    .click();
  await expect(page.locator(".water-total strong")).toHaveText("0");
  await expect(
    page.getByRole("button", { name: "Desfazer último registro", exact: true }),
  ).toBeDisabled();
});
test("hidratação inicia novo dia sem perder a meta individual", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "15m36-hydration-v1",
      JSON.stringify({ goal: 1700, date: "2020-01-01", entries: [450] }),
    ),
  );
  await page.goto("/area-de-membros#hydration");
  await expect(page.locator(".water-total strong")).toHaveText("0");
  await expect(
    page.getByLabel("Sua meta diária (ml)", { exact: true }),
  ).toHaveValue("1700");
});
test("menus e três pilares abrem as páginas correspondentes", async ({
  page,
}, testInfo) => {
  await page.goto("/area-de-membros");
  for (const [label, heading] of [
    ["Treinos", "Treinos de 15 minutos. Ação em três fases."],
    ["Alimentação", "Dieta Metabólica"],
    ["Hidratação", "Hidratação"],
    ["Meus módulos", "Meus módulos"],
    ["Meu calendário", "Seu calendário de 21 dias"],
    ["Visão geral", "SEU DESAFIO DE 21 DIAS COMEÇA AGORA."],
  ]) {
    if (testInfo.project.name === "mobile")
      await page
        .getByRole("button", { name: "Abrir menu", exact: true })
        .click();
    await page
      .locator("nav")
      .getByRole("button", { name: new RegExp(label) })
      .click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
  for (const [action, heading] of [
    ["Ir para os treinos", "Treinos de 15 minutos. Ação em três fases."],
    ["Explorar alimentação", "Dieta Metabólica"],
    ["Acompanhar hidratação", "Hidratação"],
  ]) {
    await page.goto("/area-de-membros");
    await page.getByRole("button", { name: action, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await page
      .getByRole("button", { name: "Fechar menu", exact: true })
      .last()
      .click();
    await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  }
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Voltar à página inicial", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "SEU DESAFIO DE 21 DIAS COMEÇA AGORA.",
      exact: true,
    }),
  ).toBeVisible();
});
test("armazenamento indisponível informa limitação sem simular persistência", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    };
  });
  await page.goto("/area-de-membros#lesson/workout-1");
  await expect(page.getByRole("alert")).toContainText(
    "O navegador não permitiu salvar o progresso",
  );
  await page
    .getByRole("button", { name: "Marcar como concluído", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Concluída · Desfazer", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Marcar como concluído", exact: true }),
  ).toBeVisible();
  await page.goto("/area-de-membros#hydration");
  await expect(
    page.getByText(
      "Não foi possível salvar no navegador. Os registros valem apenas para esta visita.",
      { exact: true },
    ),
  ).toBeVisible();
});
