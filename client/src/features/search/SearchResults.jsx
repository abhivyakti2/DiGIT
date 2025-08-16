import React, { useState, useEffect } from "react";
import { useSearchProfiles, useSearchRepos } from "../../api/github";
import UserProfileCard from "../user/UserProfileCard";
import RepoCard from "../repo/RepoCard";
import Loading from "../../componenets/Loading";

export default function SearchResults({ query, type }) {
  // Separate page states
  const [profilePage, setProfilePage] = useState(1);
  const [repoPage, setRepoPage] = useState(1);

  // Active tab state
  const [activeTab, setActiveTab] = useState("profiles");

  const perPage = 6;

  // Fetch profiles
  const {
    data: profiles,
    isLoading: loadingProfiles,
    isFetched: profilesFetched,
  } = useSearchProfiles({ query, page: profilePage, perPage });

  // Fetch repos
  const { data: repos, isLoading: loadingRepos } = useSearchRepos(
    { query, page: repoPage, perPage },
    {
      enabled: (type === "all" || type === "repos") && profilesFetched,
    }
  );

  // Default tab logic based on type
  useEffect(() => {
    if (type === "repos") {
      setActiveTab("repos");
    } else {
      setActiveTab("profiles");
    }
    setProfilePage(1);
    setRepoPage(1);
  }, [type, query]);

  const isLoading =
    (activeTab === "profiles" && loadingProfiles) ||
    (activeTab === "repos" && loadingRepos);

  const hasNextProfilePage = profiles?.users?.length === perPage;
  const hasNextRepoPage = repos?.repositories?.length === perPage;

  if (isLoading) return <Loading />;

  return (
    <div className="search-results animate-fade-in" style={{ padding: "0 var(--space-4)" }}>
      {/* Navbar */}
      <div className="search-tabs" style={navbarStyle}>
        <button
          className={activeTab === "profiles" ? "tab-active" : "tab-inactive"}
          style={{
            ...buttonResetStyle,
            ...(activeTab === "profiles" ? activeTabStyle : inactiveTabStyle),
          }}
          onClick={() => setActiveTab("profiles")}
        >
          👤 Profiles
        </button>
        <button
          className={activeTab === "repos" ? "tab-active" : "tab-inactive"}
          style={{
            ...buttonResetStyle,
            ...(activeTab === "repos" ? activeTabStyle : inactiveTabStyle),
          }}
          onClick={() => setActiveTab("repos")}
        >
          📦 Repositories
        </button>
      </div>

      {/* Profiles Tab */}
      {activeTab === "profiles" && profiles?.users?.length > 0 && (
        <div className="animate-slide-in">
          <div className="grid grid-auto-fit" style={gridStyle}>
            {profiles.users.map((u) => (
              <UserProfileCard key={u.username} user={u} />
            ))}
          </div>
          {/* Pagination */}
          <div className="pagination" style={paginationStyle}>
            <button 
              className="pagination-btn"
              style={{...buttonResetStyle, ...paginationButtonStyle}}
              onClick={() => setProfilePage((p) => Math.max(1, p - 1))}
              disabled={profilePage === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info" style={paginationInfoStyle}>
              Page {profilePage}
            </span>
            <button 
              className="pagination-btn"
              style={{...buttonResetStyle, ...paginationButtonStyle}}
              onClick={() => setProfilePage((p) => p + 1)}
              disabled={!hasNextProfilePage}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Repos Tab */}
      {activeTab === "repos" && repos?.repositories?.length > 0 && (
        <div className="animate-slide-in">
          <div className="grid grid-auto-fit" style={gridStyle}>
            {repos.repositories.map((r) => (
              <RepoCard key={r.id} repo={r} />
            ))}
          </div>
          {/* Pagination */}
          <div className="pagination" style={paginationStyle}>
            <button 
              className="pagination-btn"
              style={{...buttonResetStyle, ...paginationButtonStyle}}
              onClick={() => setRepoPage((p) => Math.max(1, p - 1))}
              disabled={repoPage === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info" style={paginationInfoStyle}>
              Page {repoPage}
            </span>
            <button 
              className="pagination-btn"
              style={{...buttonResetStyle, ...paginationButtonStyle}}
              onClick={() => setRepoPage((p) => p + 1)}
              disabled={!hasNextRepoPage}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {!isLoading &&
        ((activeTab === "profiles" && !profiles?.users?.length) ||
          (activeTab === "repos" && !repos?.repositories?.length)) && (
          <div className="no-results" style={noResultsStyle}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
            <h3>No results found</h3>
            <p>We couldn't find any {activeTab} matching "{query}"</p>
            <p className="text-muted">Try adjusting your search terms or browse different categories</p>
          </div>
        )}
    </div>
  );
}

const gridStyle = {
  marginTop: "var(--space-6)",
};

const paginationStyle = {
  marginTop: "var(--space-8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "var(--space-4)",
};

const navbarStyle = {
  display: "flex",
  gap: "var(--space-2)",
  marginBottom: "var(--space-6)",
  padding: "var(--space-2)",
  background: "var(--bg-secondary)",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow)",
};

const buttonResetStyle = {
  outline: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const activeTabStyle = {
  background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
  color: "white",
  borderColor: "var(--primary)",
  transform: "translateY(-2px)",
  boxShadow: "var(--shadow-md)",
};

const inactiveTabStyle = {
  background: "transparent",
  color: "var(--text-secondary)",
  borderColor: "transparent",
};

const paginationButtonStyle = {
  padding: "var(--space-3) var(--space-6)",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--text-primary)",
  fontWeight: "500",
};

const paginationInfoStyle = {
  padding: "var(--space-3) var(--space-4)",
  background: "var(--bg-tertiary)",
  borderRadius: "var(--radius)",
  color: "var(--text-primary)",
  fontWeight: "500",
  border: "1px solid var(--border)",
};

const noResultsStyle = {
  textAlign: "center",
  padding: "var(--space-16) var(--space-8)",
  color: "var(--text-secondary)",
};
