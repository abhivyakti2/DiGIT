import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useRepoDetails,
  useRepoTree,
  useRepoCommitActivity,
  useRepoContributors,
} from "../../api/github";
import CodeExplorer from "../code/CodeExplorer";
import CommitHistoryChart from "./CommitHistoryChart";
import RepoTable from "./RepoTable";

import ExportCSV from "./ExportCSV";

export default function RepoExpandedPage() {
  const { owner, repo } = useParams();
  const { data, isLoading: loadingDetails } = useRepoDetails({ owner, repo });
  const [tab, setTab] = useState("code");

  // Load data on demand for tabs
  // const { data: treeData } = useRepoTree(owner, repo, "main", {
  //   enabled: tab === "code",
  // });
  const { data: commitsData } = useRepoCommitActivity(
    { owner, repo },
    { enabled: tab === "commits" }
  );
  const { data: contributorsData } = useRepoContributors(
    { owner, repo },
    { enabled: tab === "contributors" }
  );

  const [selectedFile, setSelectedFile] = React.useState(null);

  if (loadingDetails) return <p>Loading repo details...</p>;
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
        ⭐ Stars: {stars} | 🍴 Forks: {forks} | Created:{" "}
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
      
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setTab("code")}
          disabled={tab === "code"}
          style={{
            marginRight: 10,
            outline: "none",
            color: tab === "code" ? "white" : "gray",
          }}
        >
          Code
        </button>
        <button
          onClick={() => setTab("commits")}
          disabled={tab === "commits"}
          style={{
            marginRight: 10,
            outline: "none",
            color: tab === "commits" ? "white" : "gray",
          }}
        >
          Commits History
        </button>
        <button
          onClick={() => setTab("issues")}
          disabled={tab === "issues"}
          style={{
            marginRight: 10,
            outline: "none",
            color: tab === "issues" ? "white" : "gray",
          }}
        >
          Open Issues
        </button>
        <button
          onClick={() => setTab("contributors")}
          disabled={tab === "contributors"}
          style={{
            marginRight: 10,
            outline: "none",
            color: tab === "contributors" ? "white" : "gray",
          }}
        >
          Contributors
        </button>
        <button
          onClick={() => setTab("readme")}
          disabled={tab === "readme"}
          style={{
            marginRight: 10,
            outline: "none",
            color: tab === "readme" ? "white" : "gray",
          }}
        >
          README
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === "code" && (
          <>
            {/* <CodeExplorer
              treeData={treeData?.tree || []}
              onFileSelect={handleFileSelect}
            /> */}
            {/* TODO: FileViewer & AIFileQA if selectedFile */}
          </>
        )}
        {tab === "commits" && <CommitHistoryChart data={commitsData || []} />}
        {tab === "issues" && <RepoTable data={issues || []} />}
        {tab === "contributors" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {contributorsData?.map((c) => (
              <div key={c.username} style={{ textAlign: "center" }}>
                <Link to={`/profile/${c.username}`}>
                  <img
                    src={c.avatar}
                    alt={c.username}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <div>{c.username}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "readme" && (
          <div style={{ background: "#333839ff", padding: 16, borderRadius: 8 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {readme || "No README found."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
 