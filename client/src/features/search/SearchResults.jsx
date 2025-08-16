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
    <div style={{ padding: "0 16px" }}>
      {/* Navbar */}
<div style={navbarStyle}>
  <button
    style={{
      ...buttonResetStyle,
      ...(activeTab === "profiles" ? activeTabStyle : {}),
    }}
    onClick={() => setActiveTab("profiles")}
  >
    Profiles
  </button>
  <button
    style={{
      ...buttonResetStyle,
      ...(activeTab === "repos" ? activeTabStyle : {}),
    }}
    onClick={() => setActiveTab("repos")}
  >
    Repositories
  </button>
</div>

      {/* Profiles Tab */}
      {activeTab === "profiles" && profiles?.users?.length > 0 && (
        <div>
          <div style={gridStyle}>
            {profiles.users.map((u) => (
              <UserProfileCard key={u.username} user={u} />
            ))}
          </div>
          {/* Pagination */}
          <div style={paginationStyle}>
            <button style={buttonResetStyle}
              onClick={() => setProfilePage((p) => Math.max(1, p - 1))}
              disabled={profilePage === 1}
            >
              Previous
            </button>
            <span>Page {profilePage}</span>
            <button style={buttonResetStyle}
              onClick={() => setProfilePage((p) => p + 1)}
              disabled={!hasNextProfilePage}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Repos Tab */}
      {activeTab === "repos" && repos?.repositories?.length > 0 && (
        <div>
          <div style={gridStyle}>
            {repos.repositories.map((r) => (
              <RepoCard key={r.id} repo={r} />
            ))}
          </div>
          {/* Pagination */}
          <div style={paginationStyle}>
            <button style={buttonResetStyle}
              onClick={() => setRepoPage((p) => Math.max(1, p - 1))}
              disabled={repoPage === 1}
            >
              Previous
            </button>
            <span>Page {repoPage}</span>
            <button style={buttonResetStyle}
              onClick={() => setRepoPage((p) => p + 1)}
              disabled={!hasNextRepoPage}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {!isLoading &&
        ((activeTab === "profiles" && !profiles?.users?.length) ||
          (activeTab === "repos" && !repos?.repositories?.length)) && (
          <p>No results found for "{query}"</p>
        )}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "16px",
  marginTop: "12px",
};

const paginationStyle = {
  marginTop: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
};

const navbarStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
};

const buttonResetStyle = {
  outline: "none",
  cursor: "pointer",
};

const activeTabStyle = {
  ...buttonResetStyle,
  background: "#007bff",
  color: "#fff",
  borderColor: "#007bff",
};
