import React, { useState } from "react";
import Loading from "../../componenets/Loading";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import {
  fetchRepoDetails,
  fetchRepoCommitActivity,
  fetchRepoContributors,
  fetchRepoCommits,
  fetchRepoIssues,
  fetchRepoTree,
  fetchFileContent,
  setCommitsPage,
  setIssuesPage
} from '../../store/slices/repoSlice'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // allow raw HTML
import ContributorCard from "./ContributorCard";
import buildNestedTree from "../../utils/buildNestedTree";
import rehypeSanitize from "rehype-sanitize"; // prevent XSS
import CodeExplorer from "../code/CodeExplorer";
import CommitHistoryChart from "./CommitHistoryChart";
import RepoTable from "./RepoTable";
import IssuesTable from "./IssuesTable";
import ContributorPreview from "./ContributorPreview";

// import ExportCSV from "./ExportCSV";

export default function RepoExpandedPage() {
  const { owner, repo } = useParams();
  const dispatch = useAppDispatch();
  const {
    currentRepo,
    commitActivity,
    contributors,
    commits,
    issues,
    tree,
    fileContents,
    fileLoadingStates
  } = useAppSelector(state => state.repo);
  
  const [tab, setTab] = useState("readme");
  const [viewMode, setViewMode] = useState("graph");
  const [selectedFile, setSelectedFile] = useState(null);
  const perPage = 10;

  // Fetch initial repo details
  React.useEffect(() => {
    if (owner && repo) {
      dispatch(fetchRepoDetails({ owner, repo }));
    }
  }, [dispatch, owner, repo]);

  // Fetch data based on active tab
  React.useEffect(() => {
    if (!owner || !repo) return;

    switch (tab) {
      case "code":
        dispatch(fetchRepoTree({ owner, repo, branch: "main" }));
        break;
      case "commits":
        dispatch(fetchRepoCommitActivity({ owner, repo }));
        dispatch(fetchRepoCommits({ owner, repo, page: commits.currentPage, perPage }));
        break;
      case "issues":
        dispatch(fetchRepoIssues({ owner, repo, page: issues.currentPage, perPage }));
        break;
      case "contributors":
        dispatch(fetchRepoContributors({ owner, repo }));
        break;
    }
  }, [dispatch, owner, repo, tab, commits.currentPage, issues.currentPage]);

  // Fetch file content when selected
  React.useEffect(() => {
    if (selectedFile && owner && repo) {
      dispatch(fetchFileContent({ owner, repo, path: selectedFile }));
    }
  }, [dispatch, owner, repo, selectedFile]);

  function handleFileSelect(filePath) {
    setSelectedFile(filePath);
  }

  if (currentRepo.loading) return <Loading />;
  if (currentRepo.error) return <p>Error: {currentRepo.error}</p>;
  if (!currentRepo.data) return <p>No repository data found.</p>;

  const { stars, forks, created_at, readme, website } = currentRepo.data;
  const fileContent = fileContents[selectedFile];
  const loadingFileContent = fileLoadingStates[selectedFile];

  return (
    <div style={{ padding: 16 }}>
      <h1>{repo}</h1>
      <p>{data.description}</p>
      <p>{currentRepo.data.description}</p>
      <p>
        ⭐ : {stars} | 🍴 : {forks} | Created:{" "}
        {new Date(created_at).toLocaleDateString()}
      </p>
      {website && (
        <p>
          Project URL:{" "}
          <a href={website} target="_blank" rel="noreferrer">
            {website}
          </a>
        </p>
      )}

      <div className="search-tabs" style={navbarStyle}>
        {["readme", "code", "commits", "issues", "contributors"].map((t) => (
          <button
            key={t}
            className={tab === t ? "tab-active" : "tab-inactive"}
            style={{
              ...buttonResetStyle,
              ...(tab === t ? activeTabStyle : inactiveTabStyle),
              textTransform: "capitalize",
            }}
            onClick={() => setTab(t)}
          >
            {t === "readme"
              ? "📄 README"
              : t === "code"
              ? "💻 Code"
              : t === "commits"
              ? "📊 Commits History"
              : t === "issues"
              ? "❗ Open Issues"
              : "👥 Contributors"}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === "readme" && (
          <div className="readme-container">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {readme || "No README found."}
            </ReactMarkdown>
          </div>
        )}
        {tab === "code" && (
          <>
            <CodeExplorer
              treeData={tree.data ? buildNestedTree(tree.data) : []}
              onFileSelect={handleFileSelect}
            />

            {/* Display code of selected file */}
            {selectedFile && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  overflowX: "auto",
                  maxHeight: 400,
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                }}
              >
                {loadingFileContent ? (
                  <p>Loading file content...</p>
                ) : fileContent ? (
                  <pre>{fileContent}</pre>
                ) : (
                  <p>No file selected or content unavailable.</p>
                )}
              </div>
            )}
          </>
        )}

        {tab === "commits" &&
          (() => {
            return (
              <>
                {/* Toggle Buttons for Graph / Table */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  <button
                    onClick={() => setViewMode("graph")}
                    disabled={viewMode === "graph"}
                    style={{
                      marginRight: 10,
                      outline: "none",
                      cursor: viewMode === "graph" ? "default" : "pointer",
                      color: viewMode === "graph" ? "white" : "gray",
                      background: "transparent", // no color background
                      border: "none",
                      padding: "var(--space-3) var(--space-6)",
                      borderRadius: "var(--radius)",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                      boxShadow:
                        viewMode === "graph" ? "var(--shadow-md)" : "none",
                      transform:
                        viewMode === "graph" ? "translateY(-2px)" : "none",
                    }}
                  >
                    📊 Graph
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    disabled={viewMode === "table"}
                    style={{
                      outline: "none",
                      cursor: viewMode === "table" ? "default" : "pointer",
                      color: viewMode === "table" ? "white" : "gray",
                      background:
                        viewMode === "table" ? "var(--primary)" : "transparent",
                      border: "none",
                      padding: "var(--space-3) var(--space-6)",
                      borderRadius: "var(--radius)",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    📋 Table
                  </button>
                </div>

                {/* Conditionally render graph or table */}
                {viewMode === "graph" ? (
                  <CommitHistoryChart
                    data={commitActivity.data}
                    isLoading={commitActivity.loading}
                    isError={!!commitActivity.error}
                  />
                ) : (
                  <>
                    <div style={{ marginTop: 36, marginBottom: 12 }}>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "1.2rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        Recent Commits
                      </h2>
                    </div>
                    {commits.loading && <Loading />}
                    {!commits.loading &&
                      commits.data &&
                      commits.data.length === 0 && (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            textAlign: "center",
                          }}
                        >
                          No commits found.
                        </p>
                      )}
                    {!commits.loading &&
                      commits.data &&
                      commits.data.length > 0 && (
                        <>
                          <RepoTable
                            data={
                              commits.data?.map((commit) => ({
                                id: commit.sha,
                                title: commit.message?.split("\n")[0],
                                url: commit.url,
                                author: commit.author,
                                authorAvatar: commit.authorAvatar,
                                authorLogin: commit.authorLogin,
                                date: commit.date
                                  ? new Date(commit.date).toLocaleString() // ✅ Correct date display
                                  : "",
                                sha: commit.sha,
                              })) || []
                            }
                            columns={[
                              {
                                Header: "Message",
                                accessor: "title",
                                render: (val, row) => (
                                  <a
                                    href={row.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="View on GitHub"
                                    style={{
                                      color: "var(--primary)",
                                      textDecoration: "none",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.target.style.textDecoration =
                                        "underline")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.textDecoration = "none")
                                    }
                                  >
                                    {val}
                                  </a>
                                ),
                              },

                              {
                                Header: "Contributor",
                                accessor: "authorLogin",
                                render: (val, row) => (
                                  <ContributorPreview
                                    username={val}
                                    avatar={row.authorAvatar}
                                    author={row.author}
                                  />
                                ),
                              },
                              {
                                Header: "Date",
                                accessor: "date",
                                render: (value) => {
                                  if (!value) return "";
                                  const d = new Date(value);
                                  if (Number.isNaN(d.getTime())) {
                                    // fallback if value was already a string like "8/24/2025, 10:30:00 PM"
                                    const s = String(value);
                                    const iso = s.match(/^\d{4}-\d{2}-\d{2}/);
                                    return iso ? iso[0] : s.split(",")[0]; // show only the date part
                                  }
                                  return d.toLocaleDateString(); // no time
                                },
                              },
                            ]}
                          />

                          <div className="pagination" style={paginationStyle}>
                            <button
                              onClick={() =>
                                dispatch(setCommitsPage(Math.max(1, commits.currentPage - 1)))
                              }
                              disabled={commits.currentPage === 1}
                              style={{
                                ...buttonResetStyle,
                                ...paginationButtonStyle,
                              }}
                            >
                              ← Prev
                            </button>
                            <span style={paginationInfoStyle}>
                              Page {commits.currentPage}
                            </span>
                            <button
                              onClick={() => dispatch(setCommitsPage(commits.currentPage + 1))}
                              disabled={
                                !commits.data || commits.data.length < perPage
                              }
                              style={{
                                ...buttonResetStyle,
                                ...paginationButtonStyle,
                              }}
                            >
                              Next →
                            </button>
                          </div>
                        </>
                      )}
                  </>
                )}
              </>
            );
          })()}

        {tab === "issues" && (
          <>
            {issues.loading && <Loading />}
            {!issues.loading && issues.data && issues.data.length === 0 && (
              <p
                style={{ color: "var(--text-secondary)", textAlign: "center" }}
              >
                No open issues found.
              </p>
            )}
            {!issues.loading && issues.data && issues.data.length > 0 && (
              <>
                <IssuesTable data={issues.data || []} />
                {/* Pagination Controls */}

                <div className="pagination" style={paginationStyle}>
                  <button
                    onClick={() => dispatch(setIssuesPage(Math.max(1, issues.currentPage - 1)))}
                    disabled={issues.currentPage === 1}
                    style={{ ...buttonResetStyle, ...paginationButtonStyle }}
                  >
                    ← Prev
                  </button>
                  <span style={paginationInfoStyle}>Page {issues.currentPage}</span>
                  <button
                    onClick={() => dispatch(setIssuesPage(issues.currentPage + 1))}
                    disabled={!issues.data || issues.data.length < perPage}
                    style={{ ...buttonResetStyle, ...paginationButtonStyle }}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {tab === "contributors" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {contributors.data?.map((c) => (
              <ContributorCard key={c.username} contributor={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const paginationStyle = {
  marginTop: "var(--space-8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "var(--space-4)",
};

const buttonResetStyle = {
  outline: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
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

const activeTabStyle = {
  background:
    "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
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
