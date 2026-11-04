// Substitua videoUrl, coverUrl, materialUrl e os textos pelos conteúdos aprovados.
export const phases = [
  {
    name: "Ativar",
    level: "Iniciante",
    days: "1 a 7",
    work: 35,
    rest: 25,
    description: "Adaptação aos movimentos e condicionamento inicial.",
  },
  {
    name: "Acelerar",
    level: "Intermediário",
    days: "8 a 14",
    work: 40,
    rest: 20,
    description: "Progressão da intensidade e do condicionamento.",
  },
  {
    name: "Evoluir",
    level: "Avançado",
    days: "15 a 21",
    work: 50,
    rest: 10,
    description: "Progressão final, respeitando suas orientações e adaptações.",
  },
];
// IDs anteriores permanecem associados ao mesmo conteúdo para preservar conclusões salvas.
const workoutIds = [
  ["workout-1", "workout-2", "workout-7"],
  ["workout-3", "workout-4", "workout-8"],
  ["workout-5", "workout-6", "workout-9"],
];
const lesson = (id, title) => ({
  id,
  title,
  videoUrl: null,
  materialUrl: null,
});
export const modules = [
  {
    id: 1,
    name: "Comece aqui",
    tag: "O primeiro passo é seu",
    description:
      "Conheça o método, organize sua rotina e comece com segurança.",
    lessons: [
      "Boas-vindas do Gabriel",
      "Como funciona o desafio de 21 dias",
      "Entenda o Sistema EVO3",
      "Os três pilares do método",
      "Como organizar sua hidratação",
      "Como começar e adaptar os treinos com segurança",
    ].map((t, i) => lesson(`intro-${i + 1}`, t)),
  },
  {
    id: 2,
    name: "Super bônus: Dieta Metabólica",
    tag: "Cuidado que começa à mesa",
    description:
      "Comidas Deliciosas para Emagrecer. Organização e receitas para o dia a dia.",
    lessons: [lesson("food-1", "Conheça seu bônus alimentar")],
  },
  ...phases.map((p, i) => ({
    id: i + 3,
    name: `Sistema EVO3: Fase ${i + 1} — ${p.name}`,
    tag: `Fase ${String(i + 1).padStart(2, "0")} · ${p.level}`,
    description: p.description,
    phase: i,
    lessons: [
      ...["A", "B", "C"].map((v, j) => ({
        ...lesson(
          workoutIds[i][j],
          `Treino ${String(i * 3 + j + 1).padStart(2, "0")} — ${p.name.toUpperCase()} ${v}`,
        ),
        workout: true,
        number: i * 3 + j + 1,
        phase: i,
      })),
      ...(i === 2
        ? [lesson("closing", "Encerramento do desafio · Dia 21")]
        : []),
    ],
  })),
];
export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id })),
);
export const workouts = allLessons.filter((l) => l.workout);
export const complementaryLessons = allLessons.filter((l) => !l.workout);
// Distribuição DEMONSTRATIVA: três treinos por semana. Dias exatos dependem do Gabriel.
export const scheduleIsDemonstration = true;
export const schedule = Array.from({ length: 21 }, (_, i) => {
  const phase = Math.floor(i / 7),
    slot = [0, 2, 4].indexOf(i % 7);
  return {
    day: i + 1,
    phase,
    type: slot === -1 ? "recovery" : "training",
    workoutId: slot === -1 ? null : workoutIds[phase][slot],
    closing: i === 20,
  };
});
export const entitlements = {
  corpoSemDor: false,
  acessoVitalicio: false,
  standardAccessDays: null,
};
export const materials = [
  "Roteiro alimentar de 21 dias",
  "Cozinha na Rotina — Receitas Práticas para Comer Melhor",
  "Substituições econômicas",
  "Lista de compras",
  "Organização e preparo das refeições",
].map((title) => ({ title, url: null }));
export const recipes = [
  {
    id: 1,
    name: "Omelete com tomate",
    meal: "Café da manhã",
    method: "Fogão",
    time: 10,
    icon: "◒",
    color: "peach",
    ingredients: [
      "2 ovos",
      "1 tomate pequeno picado",
      "1 colher de chá de azeite",
      "Sal e ervas a gosto",
    ],
    steps: [
      "Bata os ovos e misture o tomate e os temperos.",
      "Aqueça o azeite em uma frigideira e cozinhe em fogo baixo até os ovos estarem firmes.",
    ],
    utensils: "Tigela, garfo e frigideira",
    yield: "1 porção",
    temperature: "Fogo baixo",
    substitutions: "Troque o tomate por abobrinha ralada.",
    side: "Pão ou fruta, conforme sua organização alimentar.",
    storage: "Consumir após o preparo.",
    allergens: "Contém ovos.",
  },
  {
    id: 2,
    name: "Legumes na air fryer",
    meal: "Almoço",
    method: "Air fryer",
    time: 20,
    icon: "✳",
    color: "sage",
    ingredients: [
      "1 cenoura",
      "1 abobrinha",
      "1 colher de sopa de azeite",
      "Ervas a gosto",
    ],
    steps: [
      "Lave e corte os legumes em pedaços semelhantes.",
      "Misture com azeite e ervas. Asse a 180 °C por cerca de 15 minutos, mexendo na metade e conferindo o ponto.",
    ],
    utensils: "Faca, tábua e air fryer",
    yield: "2 porções",
    temperature: "180 °C; ajuste conforme o aparelho",
    substitutions: "Use os legumes disponíveis em casa.",
    side: "Arroz, feijão e uma fonte de proteína de sua preferência.",
    storage: "Refrigerar em recipiente fechado e consumir em até 2 dias.",
    allergens: "Confira os rótulos dos temperos utilizados.",
  },
  {
    id: 3,
    name: "Vitamina de banana e aveia",
    meal: "Café da tarde",
    method: "Liquidificador",
    time: 5,
    icon: "◐",
    color: "lavender",
    ingredients: ["1 banana", "200 ml de leite", "1 colher de sopa de aveia"],
    steps: [
      "Coloque todos os ingredientes no liquidificador.",
      "Bata até ficar homogêneo e sirva.",
    ],
    utensils: "Liquidificador e copo",
    yield: "1 porção",
    temperature: "Não se aplica",
    substitutions: "Use bebida vegetal de sua preferência.",
    side: "Sirva conforme sua rotina alimentar.",
    storage: "Consumir imediatamente.",
    allergens: "Contém leite; aveia pode conter glúten. Verifique os rótulos.",
  },
  {
    id: 4,
    name: "Salada de grão-de-bico",
    meal: "Jantar",
    method: "Sem cozimento",
    time: 10,
    icon: "✺",
    color: "sand",
    ingredients: [
      "1 xícara de grão-de-bico já cozido",
      "1 tomate",
      "½ pepino",
      "1 colher de sopa de azeite",
    ],
    steps: [
      "Lave e pique o tomate e o pepino.",
      "Misture com o grão-de-bico cozido e tempere com azeite.",
    ],
    utensils: "Tigela, faca e tábua",
    yield: "2 porções",
    temperature: "Não se aplica",
    substitutions: "Troque o grão-de-bico por feijão cozido.",
    side: "Combine com outros alimentos de sua preferência.",
    storage: "Manter refrigerada e consumir em até 1 dia.",
    allergens: "Verifique os rótulos dos ingredientes utilizados.",
  },
  {
    id: 5,
    name: "Abóbora assada com ervas",
    meal: "Jantar",
    method: "Forno",
    time: 35,
    icon: "◓",
    color: "peach",
    ingredients: [
      "400 g de abóbora",
      "1 colher de sopa de azeite",
      "Ervas a gosto",
    ],
    steps: [
      "Corte a abóbora e distribua em uma assadeira.",
      "Tempere e asse a 200 °C por cerca de 30 minutos, até ficar macia.",
    ],
    utensils: "Faca, tábua e assadeira",
    yield: "2 porções",
    temperature: "200 °C; ajuste conforme o forno",
    substitutions: "Use batata-doce, conferindo o tempo de cozimento.",
    side: "Combine com uma fonte de proteína e outros alimentos.",
    storage: "Refrigerar e consumir em até 2 dias.",
    allergens: "Confira os rótulos dos temperos utilizados.",
  },
];
