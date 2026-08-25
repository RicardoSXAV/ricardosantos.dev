import type { StaticImageData } from "next/image";

export interface GithubProfile {
  name: string;
  login: string;
  bio: string;
  company: string;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  stars: number;
}

export interface GithubRepo {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  htmlUrl: string;
  isPrivate: boolean;
}

export interface GithubReadmeBadge {
  /** Alt text — matches the label rendered inside the badge. */
  label: string;
  /** The shields.io badge used in the profile README, vendored as a local SVG. */
  image: StaticImageData;
  href?: string;
}

export interface GithubReadmeSection {
  emoji: string;
  title: string;
  badgeRows: GithubReadmeBadge[][];
}
