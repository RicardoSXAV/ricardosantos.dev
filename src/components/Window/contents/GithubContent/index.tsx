"use client";

import Image from "next/image";

import "./index.styles.scss";
import RepoCard from "./components/RepoCard";
import useGithubProfile from "./hooks/useGithubProfile";
import Icon from "@/components/interface/Icon";
import {
  GITHUB_AVATAR,
  GITHUB_PROFILE_URL,
  GITHUB_README,
  GITHUB_USERNAME,
} from "@/stores/data/github.data";
import arrowUpRightIcon from "@/assets/icons/interface/arrow-up-right.svg";
import bookMarkedIcon from "@/assets/icons/interface/book-marked.svg";
import bookOpenIcon from "@/assets/icons/interface/book-open.svg";
import buildingIcon from "@/assets/icons/interface/building.svg";
import githubMarkIcon from "@/assets/icons/interface/github-mark.svg";
import mapPinIcon from "@/assets/icons/interface/map-pin.svg";
import packageIcon from "@/assets/icons/interface/package.svg";
import searchIcon from "@/assets/icons/interface/search.svg";
import starIcon from "@/assets/icons/interface/star.svg";
import tableIcon from "@/assets/icons/interface/table.svg";
import usersIcon from "@/assets/icons/interface/users.svg";

export default function GithubContent() {
  const { profile, repos, isLoading } = useGithubProfile();

  const tabs = [
    { id: "overview", label: "Overview", icon: bookOpenIcon.src, href: GITHUB_PROFILE_URL, count: null },
    { id: "repositories", label: "Repositories", icon: bookMarkedIcon.src, href: `${GITHUB_PROFILE_URL}?tab=repositories`, count: profile.publicRepos },
    { id: "projects", label: "Projects", icon: tableIcon.src, href: `${GITHUB_PROFILE_URL}?tab=projects`, count: null },
    { id: "packages", label: "Packages", icon: packageIcon.src, href: `${GITHUB_PROFILE_URL}?tab=packages`, count: null },
    { id: "stars", label: "Stars", icon: starIcon.src, href: `${GITHUB_PROFILE_URL}?tab=stars`, count: profile.stars },
  ];

  return (
    <div className="github-content">
      {/* ── Top bar ── */}
      <header className="gh-topbar">
        <div className="gh-topbar-identity">
          <Icon src={githubMarkIcon.src} size={18} className="gh-topbar-mark" />
          <span className="gh-topbar-user">{profile.login}</span>
        </div>

        <div className="gh-topbar-search" aria-hidden="true">
          <Icon src={searchIcon.src} size={12} />
          <span className="gh-topbar-search-text">
            Type <kbd className="gh-kbd">/</kbd> to search
          </span>
        </div>
      </header>

      {/* ── Profile tabs ── */}
      <nav className="gh-tabs">
        {tabs.map((tab) =>
          tab.id === "overview" ? (
            <span key={tab.id} className="gh-tab gh-tab--active">
              <Icon src={tab.icon} size={13} />
              <span>{tab.label}</span>
            </span>
          ) : (
            <a
              key={tab.id}
              href={tab.href}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-tab"
            >
              <Icon src={tab.icon} size={13} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`gh-tab-count${isLoading ? " gh-tab-count--pending" : ""}`}>
                  {tab.count}
                </span>
              )}
            </a>
          )
        )}
      </nav>

      <div className="gh-scroll-area">
        <div className="gh-layout">
          {/* ── Sidebar ── */}
          <aside className="gh-sidebar">
            <div className="gh-avatar">
              <Image
                src={GITHUB_AVATAR}
                alt={profile.name}
                fill
                sizes="120px"
                className="gh-avatar-img"
              />
            </div>

            <div className="gh-identity">
              <h1 className="gh-name">{profile.name}</h1>
              <p className="gh-login">{profile.login}</p>
            </div>

            <p className="gh-bio">{profile.bio}</p>

            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-follow-button"
            >
              Follow
            </a>

            <div className={`gh-follow-counts${isLoading ? " gh-follow-counts--pending" : ""}`}>
              <Icon src={usersIcon.src} size={13} className="gh-follow-icon" />
              <span>
                <strong>{profile.followers}</strong> followers
              </span>
              <span className="gh-dot-separator">·</span>
              <span>
                <strong>{profile.following}</strong> following
              </span>
            </div>

            <ul className="gh-details">
              <li className="gh-detail">
                <Icon src={buildingIcon.src} size={13} />
                <span>{profile.company}</span>
              </li>
              <li className="gh-detail">
                <Icon src={mapPinIcon.src} size={13} />
                <span>{profile.location}</span>
              </li>
            </ul>
          </aside>

          {/* ── Main column ── */}
          <div className="gh-main">
            {/* Profile README */}
            <section className="gh-readme-card">
              <p className="gh-readme-path">
                {GITHUB_USERNAME} / <span className="gh-readme-file">README</span>
                <span className="gh-readme-ext">.md</span>
              </p>

              <h2 className="gh-readme-greeting">
                <span className="gh-emoji">{GITHUB_README.greetingEmoji}</span>
                {GITHUB_README.greeting}
              </h2>

              <div className="gh-badge-row">
                {GITHUB_README.contactBadges.map((badge) => (
                  <a
                    key={badge.label}
                    href={badge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gh-badge gh-badge--link"
                  >
                    <Image src={badge.image} alt={badge.label} className="gh-badge-img" unoptimized />
                  </a>
                ))}
              </div>

              <ul className="gh-facts">
                {GITHUB_README.facts.map((fact) => (
                  <li key={fact.text} className="gh-fact">
                    <span className="gh-emoji">{fact.emoji}</span>
                    <span>
                      {fact.text}
                      {fact.link && (
                        <a
                          href={fact.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gh-inline-link"
                        >
                          {fact.link.label}
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {GITHUB_README.sections.map((section) => (
                <div key={section.title} className="gh-readme-section">
                  <h3 className="gh-readme-heading">
                    <span className="gh-emoji">{section.emoji}</span>
                    {section.title}
                  </h3>
                  {section.badgeRows.map((row, index) => (
                    <div key={index} className="gh-badge-row">
                      {row.map((badge) => (
                        <span key={badge.label} className="gh-badge">
                          <Image src={badge.image} alt={badge.label} className="gh-badge-img" unoptimized />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </section>

            {/* Pinned repositories */}
            <section className="gh-pinned">
              <div className="gh-pinned-header">
                <h3 className="gh-pinned-title">Pinned</h3>
                <a
                  href={`${GITHUB_PROFILE_URL}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-pinned-link"
                >
                  View all repositories
                </a>
              </div>

              <div className="gh-pinned-grid">
                {repos.map((repo) => (
                  <RepoCard key={repo.name} repo={repo} isPending={isLoading} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ── Fixed CTA ── */}
      <div className="github-footer">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gh-cta-button"
        >
          <Icon src={githubMarkIcon.src} color="#ffffff" size={16} className="gh-cta-icon" />
          <span>View in GitHub</span>
          <Icon src={arrowUpRightIcon.src} color="#ffffff" size={14} className="gh-cta-arrow" />
        </a>
      </div>
    </div>
  );
}
