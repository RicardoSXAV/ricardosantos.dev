import profileImage from "@/assets/resume/profile-image.jpeg";
import awsBadge from "@/assets/github/aws.svg";
import dockerBadge from "@/assets/github/docker.svg";
import gitBadge from "@/assets/github/git.svg";
import goBadge from "@/assets/github/go.svg";
import jestBadge from "@/assets/github/jest.svg";
import linkedinBadge from "@/assets/github/linkedin.svg";
import mongodbBadge from "@/assets/github/mongodb.svg";
import nestjsBadge from "@/assets/github/nestjs.svg";
import nextjsBadge from "@/assets/github/nextjs.svg";
import nodejsBadge from "@/assets/github/nodejs.svg";
import postgresBadge from "@/assets/github/postgres.svg";
import reactBadge from "@/assets/github/react.svg";
import reactNativeBadge from "@/assets/github/react-native.svg";
import reduxBadge from "@/assets/github/redux.svg";
import sendEmailBadge from "@/assets/github/send-email.svg";
import type {
  GithubProfile,
  GithubReadmeBadge,
  GithubReadmeSection,
  GithubRepo,
} from "@/ts/interfaces/github.interfaces";

export const GITHUB_USERNAME = "RicardoSXAV";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
export const GITHUB_AVATAR = profileImage;

/** Pinned repositories are only exposed through GitHub's GraphQL API (which needs a
 *  token), so the selection lives here and the details are hydrated from the public
 *  REST API at runtime. Keep this list in sync with the pins on the profile. */
export const GITHUB_PINNED_REPOS = [
  "ricardosantos.dev",
  "imagine-lacos-client",
  "imagine-lacos-server",
  "imagine-lacos",
] as const;

/** Used until the API responds — and permanently if it is unreachable or rate limited. */
export const GITHUB_PROFILE_FALLBACK: GithubProfile = {
  name: "Ricardo dos Santos",
  login: GITHUB_USERNAME,
  bio: "Software Developer at MindCloud",
  company: "MindCloud",
  location: "Brasília, Brasil",
  followers: 7,
  following: 13,
  publicRepos: 26,
  stars: 14,
};

export const GITHUB_REPOS_FALLBACK: GithubRepo[] = [
  {
    name: "ricardosantos.dev",
    description: "Portfolio website using Next.js",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    htmlUrl: `${GITHUB_PROFILE_URL}/ricardosantos.dev`,
    isPrivate: false,
  },
  {
    name: "imagine-lacos-client",
    description: "Website em ReactJS de um e-commerce para venda de laços e outros produtos infantis.",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    htmlUrl: `${GITHUB_PROFILE_URL}/imagine-lacos-client`,
    isPrivate: false,
  },
  {
    name: "imagine-lacos-server",
    description: "API em NodeJS de um e-commerce para venda de laços e outros produtos infantis.",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    htmlUrl: `${GITHUB_PROFILE_URL}/imagine-lacos-server`,
    isPrivate: false,
  },
  {
    name: "imagine-lacos",
    description: "E-commerce para venda de laços e outros acessórios infantis.",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    htmlUrl: `${GITHUB_PROFILE_URL}/imagine-lacos`,
    isPrivate: false,
  },
];

/** The badges are the exact shields.io SVGs used in the profile README, saved locally so
 *  they render offline and never depend on img.shields.io being reachable. Regenerate a
 *  badge by re-downloading its README URL into `src/assets/github/`. */
const CONTACT_BADGES: GithubReadmeBadge[] = [
  { label: "Send Email", image: sendEmailBadge, href: "mailto:ricardosantosxav@gmail.com" },
  { label: "LinkedIn", image: linkedinBadge, href: "https://linkedin.com/in/ricardosantosxav" },
];

const TECH_SECTION: GithubReadmeSection = {
  emoji: "⚙️",
  title: "Tech",
  badgeRows: [
    [
      { label: "React", image: reactBadge },
      { label: "React Native", image: reactNativeBadge },
      { label: "Next.js", image: nextjsBadge },
      { label: "Redux", image: reduxBadge },
    ],
    [
      { label: "Node.js", image: nodejsBadge },
      { label: "Nest.js", image: nestjsBadge },
      { label: "Docker", image: dockerBadge },
      { label: "Postgres", image: postgresBadge },
      { label: "MongoDB", image: mongodbBadge },
    ],
    [
      { label: "Git", image: gitBadge },
      { label: "Jest", image: jestBadge },
      { label: "AWS", image: awsBadge },
    ],
  ],
};

const LEARNING_SECTION: GithubReadmeSection = {
  emoji: "📚",
  title: "Learning",
  badgeRows: [[{ label: "Go", image: goBadge }]],
};

export const GITHUB_README = {
  path: "README.md",
  greeting: "Hello, I'm Ricardo!",
  greetingEmoji: "👋",
  contactBadges: CONTACT_BADGES,
  facts: [
    { emoji: "💻", text: "Full Stack Engineer at ", link: { label: "MindCloud", href: "https://mindcloud.co" } },
    { emoji: "⭐", text: "4+ years working as a software developer", link: null },
    { emoji: "🌎", text: "Brasília, Brazil", link: null },
  ],
  sections: [TECH_SECTION, LEARNING_SECTION],
} as const;

export const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Python: "#3572a5",
  Go: "#00add8",
  Ruby: "#701516",
  Shell: "#89e051",
  Dart: "#00b4ab",
  Java: "#b07219",
  C: "#555555",
};

export const GITHUB_DEFAULT_LANGUAGE_COLOR = "#8b949e";
