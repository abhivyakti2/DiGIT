import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  useRepoDetails,
  useRepoTree,
  useRepoCommitActivity,
  useRepoContributors,
} from '../../api/github'
import CodeExplorer from '../code/CodeExplorer'
import CommitHistoryChart from './CommitHistoryChart'
import RepoTable from './RepoTable'
import ExportCSV from './ExportCSV'
// import Tooltip from '../../components/Tooltip'

export default function RepoExpandedPage() {
  const { owner, repo } = useParams()
  const { data, isLoading: loadingDetails } = useRepoDetails({ owner, repo })
  const [tab, setTab] = useState('code')

  // Load data on demand for tabs
  const { data: treeData } = useRepoTree({ owner, repo }, { enabled: tab === 'code' })
  const { data: commitsData } = useRepoCommits({ owner, repo }, { enabled: tab === 'commits' })
  const { data: issuesData } = useRepoIssues({ owner, repo }, { enabled: tab === 'issues' })
  const { data: contributorsData } = useRepoContributors({ owner, repo }, { enabled: tab === 'contributors' })

  // State for expanding folders or viewing code:
  const [selectedFile, setSelectedFile] = React.useState(null)

  if (loadingDetails) return <p>Loading repo details...</p>
  if (!data) return <p>No repository data found.</p>

  const { stars, forks, created_at, readme, website } = data

  function handleFileSelect(filePath) {
    setSelectedFile(filePath)
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>{repo}</h1>
      <p>{data.description}</p>
      <p>
        ⭐ Stars: {stars} | 🍴 Forks: {forks} | Created: {new Date(created_at).toLocaleDateString()}
      </p>
      {website && (
        <p>
          Project URL:{' '}
          <a href={website} target="_blank" rel="noreferrer">
            {website}
          </a>
        </p>
      )}
      {readme && (
        <div>
          <h3>README</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 8 }}>{readme.slice(0, 800)}...</pre>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab('code')} disabled={tab === 'code'}>
          Code
        </button>
        <button onClick={() => setTab('commits')} disabled={tab === 'commits'}>
          Commits History
        </button>
        <button onClick={() => setTab('issues')} disabled={tab === 'issues'}>
          Open Issues
        </button>
        <button onClick={() => setTab('contributors')} disabled={tab === 'contributors'}>
          Contributors
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === 'code' && (
          <>
            <CodeExplorer treeData={treeData?.tree || []} onFileSelect={handleFileSelect} />
            {/* Implement FileViewer & AIFileQA somewhere below here when selectedFile is set */}
          </>
        )}
        {tab === 'commits' && <CommitHistoryChart data={commitsData?.activity || []} />}
        {tab === 'issues' && <RepoTable data={issuesData || []} />}
        {tab === 'contributors' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {contributorsData?.contributors?.map(c => (
              <Tooltip key={c.username} text={c.username}>
                <Link to={`/profile/${c.username}`}>
                  <img
                    src={c.avatar}
                    alt={c.username}
                    style={{ width: 50, height: 50, borderRadius: '50%', cursor: 'pointer' }}
                  />
                </Link>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
