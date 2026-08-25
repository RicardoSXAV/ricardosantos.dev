"use client";

import "./RepoCard.styles.scss";
import Icon from "@/components/interface/Icon";
import {
  GITHUB_DEFAULT_LANGUAGE_COLOR,
  GITHUB_LANGUAGE_COLORS,
} from "@/stores/data/github.data";
import type { GithubRepo } from "@/ts/interfaces/github.interfaces";
import bookMarkedIcon from "@/assets/icons/interface/book-marked.svg";
import gitForkIcon from "@/assets/icons/interface/git-fork.svg";
import starIcon from "@/assets/icons/interface/star.svg";

interface RepoCardProps {
  repo: GithubRepo;
  isPending?: boolean;
}

export default function RepoCard({ repo, isPending = false }: RepoCardProps) {
  const languageColor = repo.language
    ? GITHUB_LANGUAGE_COLORS[repo.language] ?? GITHUB_DEFAULT_LANGUAGE_COLOR
    : GITHUB_DEFAULT_LANGUAGE_COLOR;

  return (
    <a
      href={repo.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gh-repo-card"
      title={`Open ${repo.name} on GitHub`}
    >
      <div className="gh-repo-head">
        <Icon src={bookMarkedIcon.src} size={13} className="gh-repo-icon" />
        <span className="gh-repo-name">{repo.name}</span>
        <span className="gh-repo-visibility">{repo.isPrivate ? "Private" : "Public"}</span>
      </div>

      {repo.description && <p className="gh-repo-description">{repo.description}</p>}

      <div className={`gh-repo-meta${isPending ? " gh-repo-meta--pending" : ""}`}>
        {repo.language && (
          <span className="gh-repo-language">
            <span className="gh-repo-language-dot" style={{ backgroundColor: languageColor }} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="gh-repo-stat">
            <Icon src={starIcon.src} size={12} />
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="gh-repo-stat">
            <Icon src={gitForkIcon.src} size={12} />
            {repo.forks}
          </span>
        )}
      </div>
    </a>
  );
}
