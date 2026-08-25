"use client";

import { useEffect, useState } from "react";

import {
  GITHUB_PINNED_REPOS,
  GITHUB_PROFILE_FALLBACK,
  GITHUB_REPOS_FALLBACK,
  GITHUB_USERNAME,
} from "@/stores/data/github.data";
import type { GithubProfile, GithubRepo } from "@/ts/interfaces/github.interfaces";

const API_BASE = "https://api.github.com";
const CACHE_KEY = "github-profile-cache";
const CACHE_TTL = 1000 * 60 * 15;

interface GithubData {
  profile: GithubProfile;
  repos: GithubRepo[];
}

interface CachedGithubData extends GithubData {
  fetchedAt: number;
}

interface GithubUserResponse {
  name: string | null;
  login: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

interface GithubRepoResponse {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  private: boolean;
}

/** The unauthenticated API allows 60 requests per hour per IP, so responses are cached
 *  for the session and reused every time the window is reopened. */
function readCache(): GithubData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedGithubData;
    if (Date.now() - cached.fetchedAt > CACHE_TTL) return null;

    return { profile: cached.profile, repos: cached.repos };
  } catch {
    return null;
  }
}

function writeCache(data: GithubData) {
  try {
    const payload: CachedGithubData = { ...data, fetchedAt: Date.now() };
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable (private mode / quota) — the data is still usable.
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);

  return response.json() as Promise<T>;
}

function toRepo(repo: GithubRepoResponse): GithubRepo {
  return {
    name: repo.name,
    description: repo.description ?? "",
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    htmlUrl: repo.html_url,
    isPrivate: repo.private,
  };
}

/** Keeps the pinned order defined in the data file, ignoring repos that were unpinned. */
function selectPinnedRepos(repos: GithubRepoResponse[]): GithubRepo[] {
  const byName = new Map(repos.map((repo) => [repo.name, repo]));

  return GITHUB_PINNED_REPOS.map((name) => byName.get(name))
    .filter((repo): repo is GithubRepoResponse => Boolean(repo))
    .map(toRepo);
}

async function fetchGithubData(): Promise<GithubData> {
  const [user, repos, starred] = await Promise.all([
    getJson<GithubUserResponse>(`/users/${GITHUB_USERNAME}`),
    getJson<GithubRepoResponse[]>(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
    getJson<unknown[]>(`/users/${GITHUB_USERNAME}/starred?per_page=100`),
  ]);

  const pinned = selectPinnedRepos(repos);

  return {
    profile: {
      name: user.name ?? user.login,
      login: user.login,
      bio: user.bio ?? GITHUB_PROFILE_FALLBACK.bio,
      company: user.company ?? GITHUB_PROFILE_FALLBACK.company,
      location: user.location ?? GITHUB_PROFILE_FALLBACK.location,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      stars: starred.length,
    },
    repos: pinned.length ? pinned : GITHUB_REPOS_FALLBACK,
  };
}

export default function useGithubProfile() {
  const [data, setData] = useState<GithubData>(
    () =>
      readCache() ?? { profile: GITHUB_PROFILE_FALLBACK, repos: GITHUB_REPOS_FALLBACK }
  );
  const [isLoading, setIsLoading] = useState(() => !readCache());

  useEffect(() => {
    if (readCache()) return;

    let isActive = true;

    fetchGithubData()
      .then((fresh) => {
        writeCache(fresh);
        if (isActive) setData(fresh);
      })
      .catch(() => {
        // Offline or rate limited — the fallback snapshot stays on screen.
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { ...data, isLoading };
}
