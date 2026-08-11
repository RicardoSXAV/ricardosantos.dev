import profileImage from "@/assets/resume/profile-image.jpeg";
import mindcloudLogo from "@/assets/resume/mindcloud-logo.jpeg";
import gotuLogo from "@/assets/resume/gotu-logo.jpeg";
import flyuoLogo from "@/assets/resume/fluyo-logo.jpeg";
import going2Logo from "@/assets/resume/going-2-logo.jpeg";
import cjrLogo from "@/assets/resume/cjr-logo.jpeg";
import universityLogo from "@/assets/resume/university-of-brasilia.jpeg";

const EXPERIENCE_EN = [
  {
    company: "MindCloud",
    role: "Full Stack Engineer",
    period: "Jul 2024 – Present",
    bullets: [
      "Developed and enhanced front-end features using React and back-end services with Node.js.",
      "Resolved user-reported issues and refactored code to improve reliability and maintainability.",
      "Implemented LLM-powered features to simplify user workflows and improve overall product usability.",
    ],
  },
  {
    company: "GoTu",
    role: "Software Developer",
    period: "Jan 2023 – May 2024",
    bullets: [
      "Implemented a CI/CD pipeline for the React Native app using Bitrise, cutting deployment time 1hr → 15min (75%) for 200K+ users.",
      "Led the rebranding of the dental portal (React, Redux) and mobile app with Framer Motion animations, boosting CTR by 15%.",
      "Designed and deployed 5+ event-driven microservices (Express.js, Prisma, MongoDB, Kafka) for payment authorization and fraud detection, preventing $200K+ fraud losses.",
    ],
  },
  {
    company: "Fluyo",
    role: "Mobile Developer",
    period: "Apr 2022 – Jan 2023",
    bullets: [
      "Developed a cross-platform language-learning mobile app using React Native and TypeScript.",
      "Implemented E2E tests with Detox, reducing bugs by ~30% and increasing app stability.",
      "Collaborated in English with an international team to deliver features and fixes on schedule.",
    ],
  },
  {
    company: "Going2",
    role: "Full Stack Developer",
    period: "Dec 2021 – Apr 2022",
    bullets: [
      "Built and optimized web and mobile applications using React, React Native, and NestJS.",
      "Improved backend scalability and fault tolerance in complex APIs.",
      "Collaborated in an Agile environment using Jira and Bitbucket.",
    ],
  },
  {
    company: "CJR",
    role: "Web Developer Intern",
    period: "Sep 2021 – Mar 2022",
    bullets: [
      "Completed a competitive web development trainee program focused on HTML, CSS, JavaScript, React, and Ruby on Rails.",
      "Contributed to both front-end and back-end development of a website prototype.",
      "Led a React training program for 30+ students, mentoring them in practical React skills.",
    ],
  },
] as const;

const EXPERIENCE_PT = [
  {
    company: "MindCloud",
    role: "Engenheiro Full Stack",
    period: "Jul 2024 – Presente",
    bullets: [
      "Desenvolvi e aprimorei funcionalidades de front-end com React e serviços de back-end com Node.js.",
      "Corrigi problemas reportados por usuários e refatorei código para melhorar confiabilidade e manutenibilidade.",
      "Implementei funcionalidades baseadas em LLM para simplificar fluxos de trabalho e melhorar a usabilidade do produto.",
    ],
  },
  {
    company: "GoTu",
    role: "Desenvolvedor de Software",
    period: "Jan 2023 – Mai 2024",
    bullets: [
      "Implementei pipeline de CI/CD para o app React Native com Bitrise, reduzindo o tempo de deploy de 1h para 15min (75%) para 200K+ usuários.",
      "Liderei o rebranding do portal odontológico (React, Redux) e do app mobile com animações em Framer Motion, aumentando o CTR em 15%.",
      "Projetei e implantei 5+ microsserviços orientados a eventos (Express.js, Prisma, MongoDB, Kafka) para autorização de pagamentos e detecção de fraudes, prevenindo $200K+ em perdas.",
    ],
  },
  {
    company: "Fluyo",
    role: "Desenvolvedor Mobile",
    period: "Abr 2022 – Jan 2023",
    bullets: [
      "Desenvolvi um app mobile multiplataforma de aprendizado de idiomas usando React Native e TypeScript.",
      "Implementei testes E2E com Detox, reduzindo bugs em ~30% e aumentando a estabilidade do app.",
      "Colaborei em inglês com uma equipe internacional para entregar funcionalidades e correções dentro do prazo.",
    ],
  },
  {
    company: "Going2",
    role: "Desenvolvedor Full Stack",
    period: "Dez 2021 – Abr 2022",
    bullets: [
      "Construí e otimizei aplicações web e mobile usando React, React Native e NestJS.",
      "Melhorei a escalabilidade e tolerância a falhas do backend em APIs complexas.",
      "Colaborei em ambiente Ágil utilizando Jira e Bitbucket.",
    ],
  },
  {
    company: "CJR",
    role: "Estagiário de Desenvolvimento Web",
    period: "Set 2021 – Mar 2022",
    bullets: [
      "Concluí programa trainee de desenvolvimento web com foco em HTML, CSS, JavaScript, React e Ruby on Rails.",
      "Contribuí para o desenvolvimento front-end e back-end de um protótipo de website.",
      "Conduzi um programa de treinamento em React para mais de 30 alunos.",
    ],
  },
] as const;

const SKILLS_EN = [
  { category: "AI & Data",               items: ["LLM Integration (GPT-4o, Claude)", "Semantic Search", "Prompt Engineering"] },
  { category: "Languages & Frameworks",  items: ["TypeScript", "JavaScript", "Node.js (Nest.js, Express.js)", "Python", "React", "React Native", "Next.js", "Prisma ORM"] },
  { category: "Data & Infrastructure",   items: ["PostgreSQL", "MongoDB", "Firebase", "Redis", "Elasticsearch", "GraphQL", "REST APIs", "WebSockets"] },
  { category: "Cloud & DevOps",          items: ["AWS (Lambda, ECS, S3, CloudWatch)", "Docker", "CI/CD (GitHub Actions, Vercel)"] },
  { category: "Testing & Practices",     items: ["Jest", "Vitest", "React Testing Library", "Detox", "Cypress", "TDD", "Agile/Scrum"] },
] as const;

const SKILLS_PT = [
  { category: "IA & Dados",              items: ["Integração com LLM (GPT-4o, Claude)", "Busca Semântica", "Engenharia de Prompts"] },
  { category: "Linguagens & Frameworks", items: ["TypeScript", "JavaScript", "Node.js (Nest.js, Express.js)", "Python", "React", "React Native", "Next.js", "Prisma ORM"] },
  { category: "Dados & Infraestrutura",  items: ["PostgreSQL", "MongoDB", "Firebase", "Redis", "Elasticsearch", "GraphQL", "REST APIs", "WebSockets"] },
  { category: "Cloud & DevOps",          items: ["AWS (Lambda, ECS, S3, CloudWatch)", "Docker", "CI/CD (GitHub Actions, Vercel)"] },
  { category: "Testes & Práticas",       items: ["Jest", "Vitest", "React Testing Library", "Detox", "Cypress", "TDD", "Ágil/Scrum"] },
] as const;

export const LINKEDIN_RESUME = {
  // ── Static (language-independent) ──────────────────────────────────────────
  name: "Ricardo dos Santos",
  initials: "R",
  location: "Brasília, Federal District, Brazil",
  connections: "500+",
  githubUrl: "https://github.com/RicardoSXAV",
  email: "ricardosantosxav@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/ricardosantosxav",
  currentCompany: { name: "MindCloud" },
  university: { name: "Universidade de Brasília" },
  profileImage,
  logos: {
    MindCloud: mindcloudLogo,
    GoTu: gotuLogo,
    Fluyo: flyuoLogo,
    Going2: going2Logo,
    CJR: cjrLogo,
    "Universidade de Brasília": universityLogo,
  },

  // ── English ─────────────────────────────────────────────────────────────────
  en: {
    headline: "Software Engineer | Full-Stack Developer — ReactJS · React Native · NodeJS",
    about:
      "Full Stack Software Engineer with 5+ years building scalable distributed systems. Proven expertise architecting production systems with LLM integration (OpenAI GPT-4o, Anthropic Claude). Professional level proficiency in TypeScript + React, TypeScript + Node.js backend, and PostgreSQL. Deployed AWS cloud infrastructure with Docker containers and CI/CD pipelines. Leveraged AI-assisted development to ship features 3x faster (2–3 days vs. 1–2 weeks).",
    experience: EXPERIENCE_EN,
    education: [{ school: "Universidade de Brasília", degree: "Bachelor's, Computer Engineering", period: "2019 – 2024" }],
    skills: SKILLS_EN,
    labels: {
      about: "About",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      profileLanguage: "Profile language",
      linksAndContact: "Links & Contact",
      viewInLinkedIn: "View in LinkedIn",
    },
  },

  // ── Portuguese ───────────────────────────────────────────────────────────────
  pt: {
    headline: "Engenheiro de Software | Desenvolvedor Full-Stack — ReactJS · React Native · NodeJS",
    about:
      "Engenheiro de Software Full Stack com mais de 5 anos de experiência construindo sistemas distribuídos escaláveis. Especialista em arquitetura de sistemas em produção com integração de LLM (OpenAI GPT-4o, Anthropic Claude). Proficiência em TypeScript + React, Node.js e PostgreSQL. Infraestrutura AWS com Docker e pipelines de CI/CD. Utilizei desenvolvimento assistido por IA para entregar funcionalidades 3× mais rápido (2–3 dias vs. 1–2 semanas).",
    experience: EXPERIENCE_PT,
    education: [{ school: "Universidade de Brasília", degree: "Bacharelado em Engenharia de Computação", period: "2019 – 2024" }],
    skills: SKILLS_PT,
    labels: {
      about: "Sobre",
      experience: "Experiência",
      education: "Educação",
      skills: "Habilidades",
      profileLanguage: "Idioma do perfil",
      linksAndContact: "Links & Contato",
      viewInLinkedIn: "Ver no LinkedIn",
    },
  },
} as const;

export type LinkedinLang = "en" | "pt";
