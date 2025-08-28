import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchProfiles, useSearchRepos } from "../../api/github";
import UserProfileCard from "../user/UserProfileCard";
import RepoCard from "../repo/RepoCard";
import Loading from "../../componenets/Loading";

export default function SearchResults({ query, type }) {
  if (!query || query.trim() === "") {
    return (
      <div className="no-results" style={noResultsStyle}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</div>
        <h3>Please enter a search query</h3>
        <p className="text-muted">Start typing above to find users or repositories.</p>
      </div>
    );
  }

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQ = searchParams.get("q") || "";

  // Separate page states
  const [profilePage, setProfilePage] = useState(1);
  const [repoPage, setRepoPage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);

  const [sortBy, setSortBy] = useState("stars");
  const [nameFilter, setNameFilter] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("profiles");

  // Pagination configs
  const normalPerPage = 6;
  const filteredPerPage = 6;

  // Fetch profiles
  const {
    data: profiles,
    isLoading: loadingProfiles,
    isFetched: profilesFetched,
  } = useSearchProfiles({ query, page: profilePage, perPage: normalPerPage });

  // Fetch repos
  const { data: repos, isLoading: loadingRepos } = useSearchRepos(
    { query, page: repoPage, perPage: 50 }, // fetch larger batch for client filter
    {
      enabled: (type === "all" || type === "repos") && profilesFetched,
    }
  );

  // Reset paging when query/type changes
  useEffect(() => {
    if (type === "repos") {
      setActiveTab("repos");
    } else {
      setActiveTab("profiles");
    }
    setProfilePage(1);
    setRepoPage(1);
    setFilteredPage(1);
  }, [type, query]);

  // Reset filtered page when filter changes
  useEffect(() => {
    setFilteredPage(1);
  }, [nameFilter]);

  // Apply filter + sorting (but always keep sorting intact like code 1)
  const filteredReposFull = useMemo(() => {
    let reposArr = repos?.repositories || [];

    // Filtering step
    if (nameFilter) {
      reposArr = reposArr.filter((repo) =>
        repo.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Sorting step (same as code 1, never broken)
    let sorted = [...reposArr];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy !== "none") {
      sorted.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
    }

    return sorted;
  }, [repos?.repositories, nameFilter, sortBy]);

  // Decide which slice of data to show (normal or filtered pagination)
  const filteredRepos = useMemo(() => {
    if (nameFilter) {
      const start = (filteredPage - 1) * filteredPerPage;
      return filteredReposFull.slice(start, start + filteredPerPage);
    } else {
      const start = (repoPage - 1) * normalPerPage;
      return filteredReposFull.slice(start, start + normalPerPage);
    }
  }, [filteredReposFull, nameFilter, filteredPage, repoPage]);

  const isLoading =
    (activeTab === "profiles" && loadingProfiles) ||
    (activeTab === "repos" && loadingRepos);

  const hasNextProfilePage = profiles?.users?.length === normalPerPage;

  // if (isLoading) return <Loading />;

  return (
    <div className="search-results animate-fade-in" style={{ padding: "0 var(--space-4)" }}>
      {/* Navbar */}
      <div className="search-tabs" style={navbarStyle}>
        <button
          className={activeTab === "profiles" ? "tab-active" : "tab-inactive"}
          style={{ ...buttonResetStyle, ...(activeTab === "profiles" ? activeTabStyle : inactiveTabStyle) }}
          onClick={() => {
            setActiveTab("profiles");
            navigate(`/search?q=${encodeURIComponent(currentQ)}&type=profiles`);
          }}
        >
          👤 Profiles
        </button>
        <button
          className={activeTab === "repos" ? "tab-active" : "tab-inactive"}
          style={{ ...buttonResetStyle, ...(activeTab === "repos" ? activeTabStyle : inactiveTabStyle) }}
          onClick={() => {
            setActiveTab("repos");
            navigate(`/search?q=${encodeURIComponent(currentQ)}&type=repos`);
          }}
        >
          📦 Repositories
        </button>
      </div>
      
       {isLoading && (
      <div style={{ marginTop: 24 }}>
        <Loading />
      </div>
    )}

      {/* Profiles */}
      {activeTab === "profiles" && profiles?.users?.length > 0 && (
        <div className="animate-slide-in">
          <div className="grid grid-auto-fit" style={gridStyle}>
            {profiles.users.map((u) => (
              <UserProfileCard key={u.username} user={u} />
            ))}
          </div>
          <div className="pagination" style={paginationStyle}>
            <button
              style={{ ...buttonResetStyle, ...paginationButtonStyle }}
              onClick={() => setProfilePage((p) => Math.max(1, p - 1))}
              disabled={profilePage === 1}
            >
              ← Previous
            </button>
            <span style={paginationInfoStyle}>Page {profilePage}</span>
            <button
              style={{ ...buttonResetStyle, ...paginationButtonStyle }}
              onClick={() => setProfilePage((p) => p + 1)}
              disabled={!hasNextProfilePage}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Repos */}
      {activeTab === "repos" && repos?.repositories?.length > 0 && (
        <div className="animate-slide-in">
          {/* Sort + Filter */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px", gap: "8px", alignItems: "center" }}>
            <label htmlFor="repoSort" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Sort by:
            </label>
            <select
              id="repoSort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "6px 12px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-primary)", fontWeight: "500", cursor: "pointer" }}
            >
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="open_issues">Open Issues</option>
              <option value="name">Name</option>
              <option value="none">None</option>
            </select>
            <div style={{ position: "relative", width: "180px" }}>
              <input
                type="text"
                placeholder="Filter by repo name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                style={{ height: "34px", padding: "6px 32px 6px 12px", fontSize: "14px", borderRadius: "var(--radius)", border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", width: "100%" }}
              />
              {nameFilter && (
                <button
                  type="button"
                  aria-label="Clear filter"
                  onClick={() => {
                    setNameFilter("");
                    setSortBy("stars");
                  }}
                  style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}
                >
                  ✖
                </button>
              )}
            </div>
          </div>

          {/* Repo Grid */}
          <div className="grid grid-auto-fit" style={gridStyle}>
            {filteredRepos.map((r) => (
              <RepoCard key={r.id} repo={r} />
            ))}
          </div>

          {/* Empty state */}
          {filteredRepos.length === 0 && (
            <div className="no-results" style={noResultsStyle}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</div>
              <h3>No results match</h3>
              <p>We couldn't find any repositories matching "{nameFilter}".</p>
              <p className="text-muted">Try adjusting your filter or search terms.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="pagination" style={paginationStyle}>
            <button
              onClick={() => (nameFilter ? setFilteredPage((p) => Math.max(1, p - 1)) : setRepoPage((p) => Math.max(1, p - 1)))}
              disabled={nameFilter ? filteredPage === 1 : repoPage === 1}
              style={{ ...buttonResetStyle, ...paginationButtonStyle }}
            >
              ← Previous
            </button>
            <span style={paginationInfoStyle}>
              Page {nameFilter ? filteredPage : repoPage}
            </span>
            <button
              onClick={() => (nameFilter ? setFilteredPage((p) => p + 1) : setRepoPage((p) => p + 1))}
              disabled={
                nameFilter
                  ? filteredPage >= Math.ceil(filteredReposFull.length / filteredPerPage)
                  : repoPage >= Math.ceil((repos?.repositories?.length || 0) / normalPerPage)
              }
              style={{ ...buttonResetStyle, ...paginationButtonStyle }}
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
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</div>
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