import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserDetails } from "../../api/github";
import RepoCard from "../repo/RepoCard"; // Make sure this is imported

export default function UserExpandedProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUserDetails(username);

  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Filtering, sorting and paging
  const filteredRepos = useMemo(() => {
    let filtered = data?.repositories || [];
    if (filter) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
    }
    return filtered;
  }, [data?.repositories, filter, sortBy]);

  const totalPages = Math.ceil(filteredRepos.length / perPage);
  const paginatedRepos = filteredRepos.slice((page - 1) * perPage, page * perPage);

  // States
  if (isLoading) return <p>Loading user profile...</p>;
  if (error) return <p>Error loading user profile.</p>;
  if (!data) return <p>No data found.</p>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      {/* Navbar with Back Link */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        
      </div>
      {/* User Info */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
        <img
          src={data.avatar}
          alt={`${data.username}'s avatar`}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            marginRight: "16px",
            border: "1px solid var(--border)"
          }}
        />
        <div>
          <h2 style={{ margin: "0", color: "#fff" }}>{data.username}</h2>
          {data.bio && (
            <p style={{ margin: "6px 0 0", color: "#aaa" }}>{data.bio}</p>
          )}
           <div style={{
      display: 'flex',
      gap: '32px',
      marginBottom: '8px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.4rem' }}>{data.followers ?? 0}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Followers</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.4rem' }}>{data.following ?? 0}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Following</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.4rem' }}>{data.public_repos ?? 0}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Repos</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
          {Array.isArray(data.repoLanguages)
            ? data.repoLanguages.slice(0,3).join(', ')
            : '—'}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Top Languages</div>
      </div>
      {data.location && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {data.location}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Location</div>
        </div>
      )}
      {data.website && (
        <div style={{ textAlign: 'center' }}>
          <a href={data.website} target="_blank" rel="noopener noreferrer"
             style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', wordBreak: 'break-all' }}>
            Website
          </a>
          <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}></div>
        </div>
      )}
    </div>
    {/* Latest Commit Date */}
    {data.latestCommitDate && (
      <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: '4px' }}>
        Latest commit: {new Date(data.latestCommitDate).toLocaleDateString()}
      </div>
    )}
  </div>
      </div>
      {/* Controls & Heading */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "60px",
          alignItems: "center",
          marginBottom: "16px"
        }}
      >
        <h2 style={{ color: "#fff" }}>Repositories</h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: "8px 24px 8px 8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              appearance: "none",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              backgroundImage:
                "linear-gradient(45deg, transparent 50%, #ccc 50%), linear-gradient(135deg, #ccc 50%, transparent 50%)",
              backgroundPosition:
                "calc(100% - 12px) calc(1em + 2px), calc(100% - 8px) calc(1em + 2px)",
              backgroundSize: "5px 5px, 5px 5px",
              backgroundRepeat: "no-repeat"
            }}
          >
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="open_issues">Open Issues</option>
            <option value="name">Name</option>
          </select>
          <input
            type="text"
            placeholder="Filter repos by name"
            value={filter}
            onChange={e => {
              setPage(1);
              setFilter(e.target.value);
            }}
            style={{
              width: "180px",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
      </div>
      {/* Repository Grid using RepoCard */}
      <div className="grid grid-auto-fit" style={{ display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-6)" }}>
        {paginatedRepos.map(repo => (
          // If api doesn't provide repo.owner, fallback to username
          <RepoCard
            key={repo.id}
            repo={{
              ...repo,
              owner: repo.owner || data.username
            }}
            hideOwner={true}
          />
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          className="pagination"
          style={{
            marginTop: "var(--space-8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--space-4)"
          }}
        >
          <button
            className="pagination-btn"
            style={{
              padding: "var(--space-3) var(--space-6)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontWeight: "500"
            }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span
            className="pagination-info"
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontWeight: "500",
              border: "1px solid var(--border)"
            }}
          >
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            style={{
              padding: "var(--space-3) var(--space-6)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontWeight: "500"
            }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
      {filteredRepos.length === 0 && (
        <p style={{ marginTop: "20px" }}>No repositories found for the given filter.</p>
      )}
    </div>
  );
}
