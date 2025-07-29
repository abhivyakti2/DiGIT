import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRepoDetails } from '../../api/github'
import CodeExplorer from '../code/CodeExplorer'
import CommitHistoryChart from './CommitHistoryChart'
import ContributorsList from './ContributorsList' // Should have avatar+tooltip+profile

export default function RepoExpandedPage() {
  const { owner, repo } = useParams()
  const { data } = useRepoDetails({ owner, repo })
  const [tab, setTab] = useState('code')

  if (!data) return <div>Loading...</div>
  return (
    <div>
      <h2>{repo} ({owner})</h2>
      <p>{data.readme}</p>
      <p>⭐ {data.stars}, Forks: {data.forks}, Created: {data.created_at}</p>
      {data.website && <a href={data.website}>Live</a>}
      <div>
        <button onClick={() => setTab('code')}>Code</button>
        <button onClick={() => setTab('commits')}>Commits History</button>
        <button onClick={() => setTab('issues')}>Open Issues</button>
        <button onClick={() => setTab('contributors')}>Contributors</button>
      </div>
      {tab === 'code' && <CodeExplorer repo={repo} owner={owner} />}
      {tab === 'commits' && <CommitHistoryChart repo={repo} owner={owner} />}
      {tab === 'contributors' && <ContributorsList repo={repo} owner={owner} />}
      {/* etc */}
    </div>
  )
}
