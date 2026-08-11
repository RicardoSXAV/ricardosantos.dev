"use client";

import { useState } from "react";
import Image from "next/image";
import "./index.styles.scss";
import { LINKEDIN_RESUME, type LinkedinLang } from "@/stores/data/apps.data";
import Icon from "@/components/interface/Icon";
import arrowUpRightIcon from "@/assets/icons/interface/arrow-up-right.svg";
import githubMarkIcon from "@/assets/icons/interface/github-mark.svg";
import linkedinMarkIcon from "@/assets/icons/interface/linkedin-mark.svg";
import mailFilledIcon from "@/assets/icons/interface/mail-filled.svg";

export default function LinkedinContent() {
  const [lang, setLang] = useState<LinkedinLang>("en");
  const t = LINKEDIN_RESUME[lang];
  const {
    name,
    location,
    connections,
    githubUrl,
    email,
    linkedinUrl,
    currentCompany,
    university,
    profileImage,
    logos,
  } = LINKEDIN_RESUME;

  return (
    <div className="linkedin-content">
      <div className="linkedin-scroll-area">
        <div className="linkedin-layout">

          {/* ── Main column ── */}
          <div className="linkedin-main">

            {/* Profile card */}
            <div className="li-card li-profile-card">
              <div className="li-cover" />

              <div className="li-profile-body">
                <div className="li-avatar">
                  <Image src={profileImage} alt={name} fill sizes="60px" className="li-avatar-img" />
                </div>

                {/* Name row: profile info (left) + affiliations (right) */}
                <div className="li-profile-main">
                  <div className="li-profile-info">
                    <h1 className="li-name">
                      {name}
                    </h1>
                    <p className="li-headline">{t.headline}</p>
                    <p className="li-location">{location}</p>
                    <p className="li-connections">{connections} connections</p>
                  </div>
                  <div className="li-affiliations">
                    <div className="li-affiliation">
                      <div className="li-affiliation-logo">
                        <Image src={logos.MindCloud} alt={currentCompany.name} fill sizes="26px" className="li-logo-img" />
                      </div>
                      <span className="li-affiliation-name">{currentCompany.name}</span>
                    </div>
                    <div className="li-affiliation">
                      <div className="li-affiliation-logo">
                        <Image src={logos["Universidade de Brasília"]} alt={university.name} fill sizes="26px" className="li-logo-img" />
                      </div>
                      <span className="li-affiliation-name">{university.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="li-card li-section-card">
              <h2 className="li-section-title">{t.labels.about}</h2>
              <p className="li-body-text">{t.about}</p>
            </div>

            {/* Experience */}
            <div className="li-card li-section-card">
              <h2 className="li-section-title">{t.labels.experience}</h2>
              <div className="li-list">
                {t.experience.map((job) => (
                  <div key={job.company} className="li-list-item">
                    <div className="li-item-logo">
                      <Image src={logos[job.company as keyof typeof logos]} alt={job.company} fill sizes="36px" className="li-logo-img" />
                    </div>
                    <div className="li-item-body">
                      <p className="li-item-title">{job.role}</p>
                      <p className="li-item-subtitle">{job.company}</p>
                      <p className="li-item-meta">{job.period}</p>
                      <ul className="li-bullets">
                        {job.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="li-card li-section-card">
              <h2 className="li-section-title">{t.labels.education}</h2>
              <div className="li-list">
                {t.education.map((edu) => (
                  <div key={edu.school} className="li-list-item">
                    <div className="li-item-logo">
                      <Image src={logos["Universidade de Brasília"]} alt={edu.school} fill sizes="36px" className="li-logo-img" />
                    </div>
                    <div className="li-item-body">
                      <p className="li-item-title">{edu.school}</p>
                      <p className="li-item-subtitle">{edu.degree}</p>
                      <p className="li-item-meta">{edu.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="li-card li-section-card">
              <h2 className="li-section-title">{t.labels.skills}</h2>
              <div className="li-skills">
                {t.skills.map((group) => (
                  <div key={group.category} className="li-skill-group">
                    <p className="li-skill-category">{group.category}</p>
                    <div className="li-skill-pills">
                      {group.items.map((skill) => (
                        <span key={skill} className="li-skill-pill">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="linkedin-sidebar">

            {/* Profile language */}
            <div className="li-card li-sidebar-card">
              <h3 className="li-sidebar-title">{t.labels.profileLanguage}</h3>
              <div className="li-lang-pills">
                {(["en", "pt"] as LinkedinLang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`li-lang-pill${lang === l ? " li-lang-pill--active" : ""}`}
                    onClick={() => setLang(l)}
                  >
                    {l === "en" ? "English" : "Português"}
                  </button>
                ))}
              </div>
            </div>

            {/* Links & Contact */}
            <div className="li-card li-sidebar-card">
              <h3 className="li-sidebar-title">{t.labels.linksAndContact}</h3>
              <div className="li-contact-list">
                <a
                  href={githubUrl}
                  target="_blank"
                rel="noopener noreferrer"
                className="li-contact-item"
              >
                  <span className="li-contact-icon li-contact-icon--github">
                    <Icon src={githubMarkIcon.src} size={14} />
                  </span>
                  <span className="li-contact-text">{githubUrl.replace("https://", "")}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="li-contact-item"
                >
                  <span className="li-contact-icon li-contact-icon--email">
                    <Icon src={mailFilledIcon.src} size={14} />
                  </span>
                  <span className="li-contact-text">{email}</span>
                </a>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="linkedin-footer">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="li-cta-button"
        >
          <Icon src={linkedinMarkIcon.src} color="#ffffff" size={16} className="li-cta-icon" />
          <span>{t.labels.viewInLinkedIn}</span>
          <Icon src={arrowUpRightIcon.src} color="#ffffff" size={14} className="li-cta-arrow" />
        </a>
      </div>
    </div>
  );
}
