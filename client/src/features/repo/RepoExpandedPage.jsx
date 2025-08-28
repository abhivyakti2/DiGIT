import React, { useState } from "react";
import Loading from "../../componenets/Loading";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // allow raw HTML
import ContributorCard from "./ContributorCard";
import {
  useFileContent,
  useRepoCommits,
  useRepoIssues,
} from "../../api/github";
import buildNestedTree from "../../utils/buildNestedTree";
import rehypeSanitize from "rehype-sanitize"; // prevent XSS
import {
  useRepoDetails,
  useRepoTree,
  useRepoCommitActivity,
  useRepoContributors,
} from "../../api/github";
import CodeExplorer from "../code/CodeExplorer";
import CommitHistoryChart from "./CommitHistoryChart";
import RepoTable from "./RepoTable";
import IssuesTable from "./IssuesTable";
import ContributorPreview from "./ContributorPreview";

// import ExportCSV from "./ExportCSV";

export default function RepoExpandedPage() {
  const { owner, repo } = useParams();
  const [tab, setTab] = useState("readme");
  const [viewMode, setViewMode] = useState("graph");

  const [commitsPage, setCommitsPage] = useState(1);
  const [issuesPage, setIssuesPage] = useState(1);
  const perPage = 10;
  const { data: commitsData, isLoading: loadingCommits } = useRepoCommits(
    { owner, repo, page: commitsPage, perPage: perPage },
    { enabled: tab === "commits" }
  );
  const { data: issuesData, isLoading: loadingIssues } = useRepoIssues(
    { owner, repo, page: issuesPage, perPage: perPage },
    { enabled: tab === "issues" }
  );
  const { data, isLoading: loadingDetails } = useRepoDetails({ owner, repo });
  const { data: treeData } = useRepoTree(owner, repo, "main", {
    enabled: tab === "code",
  });
  const {
    data: commitsHistoryData,
    isLoading: loadingCommitsHistory,
    isError,
  } = useRepoCommitActivity({ owner, repo }, { enabled: tab === "commits" });
  const { data: contributorsData } = useRepoContributors(
    { owner, repo },
    { enabled: tab === "contributors" }
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const { data: fileContent, isLoading: loadingFileContent } = useFileContent(
    owner,
    repo,
    selectedFile
  );
  function handleFileSelect(filePath) {
    setSelectedFile(filePath);
  }
  if (loadingDetails) return <Loading />;
  if (!data) return <p>No repository data found.</p>;
  const { stars, forks, created_at, readme, website, issues } = data;
  function handleFileSelect(filePath) {
    setSelectedFile(filePath);
  }
  return (
    <div style={{ padding: 16 }}>
      <h1>{repo}</h1>
      <p>{data.description}</p>
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
              treeData={treeData ? buildNestedTree(treeData) : []}
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
                    data={commitsHistoryData}
                    isLoading={loadingCommitsHistory}
                    isError={isError}
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
                    {loadingCommits && <Loading />}
                    {!loadingCommits &&
                      commitsData &&
                      commitsData.length === 0 && (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            textAlign: "center",
                          }}
                        >
                          No commits found.
                        </p>
                      )}
                    {!loadingCommits &&
                      commitsData &&
                      commitsData.length > 0 && (
                        <>
                          <RepoTable
                            data={
                              commitsData?.map((commit) => ({
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
                                setCommitsPage((p) => Math.max(1, p - 1))
                              }
                              disabled={commitsPage === 1}
                              style={{
                                ...buttonResetStyle,
                                ...paginationButtonStyle,
                              }}
                            >
                              ← Prev
                            </button>
                            <span style={paginationInfoStyle}>
                              Page {commitsPage}
                            </span>
                            <button
                              onClick={() => setCommitsPage((p) => p + 1)}
                              disabled={
                                !commitsData || commitsData.length < perPage
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
            {loadingIssues && <Loading />}
            {!loadingIssues && issuesData && issuesData.length === 0 && (
              <p
                style={{ color: "var(--text-secondary)", textAlign: "center" }}
              >
                No open issues found.
              </p>
            )}
            {!loadingIssues && issuesData && issuesData.length > 0 && (
              <>
                <IssuesTable data={issuesData || []} />
                {/* Pagination Controls */}

                <div className="pagination" style={paginationStyle}>
                  <button
                    onClick={() => setIssuesPage((p) => Math.max(1, p - 1))}
                    disabled={issuesPage === 1}
                    style={{ ...buttonResetStyle, ...paginationButtonStyle }}
                  >
                    ← Prev
                  </button>
                  <span style={paginationInfoStyle}>Page {issuesPage}</span>
                  <button
                    onClick={() => setIssuesPage((p) => p + 1)}
                    disabled={!issuesData || issuesData.length < perPage}
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
            {contributorsData?.map((c) => (
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
