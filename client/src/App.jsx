import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useSearchParams
} from 'react-router-dom'
import SearchBar from './features/search/SearchBar'
import HomeInfo from './componenets/HomeInfo'
import Logo from './componenets/Logo'
import SearchResults from './features/search/SearchResults'
import UserExpandedProfile from './features/user/UserExpandedProfile'
import RepoExpandedPage from './features/repo/RepoExpandedPage'

function AppContent() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'all'

  const isHomePage = location.pathname === '/'
  const isSearchPage = location.pathname === '/search'

  return (
    <div className="min-h-screen">
      {/* Header row */}
      <div
        className="header-container"
        style={{
          display: 'flex',
          alignItems: 'center', // vertical alignment
          justifyContent: 'flex-start', // logo stays left
          padding: 'var(--space-6) var(--space-8) 0 var(--space-8)',
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          border: '1px solid var(--border)',
          borderTop: 'none'
        }}
      >
        <Logo/>
        
        {/* Only show search bar inline on non-home pages */}
        {!isHomePage && (
          <div style={{ marginLeft: '320px', marginTop: '-40px', flex: 1, maxWidth: '500px' }}>
            <SearchBar inline />
          </div>
        )}
      </div>

      {/* Page content */}
      <div
        className="main-content"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${isSearchPage ? 'var(--space-8)' : isHomePage ? 'var(--space-20)' : 'var(--space-8)'} var(--space-6) var(--space-8)`
        }}
      >
        {/* Centered search bar on homepage */}
        {isHomePage && <SearchBar />}

        <div className="animate-fade-in" style={{ marginTop: isHomePage ? 'var(--space-10)' : 'var(--space-6)' }}>
          <Routes>
            <Route path="/" element={<HomeInfo />} />
            <Route
              path="/search"
              element={<SearchResults query={query} type={type} />}
            />
            <Route path="/profile/:username" element={<UserExpandedProfile />} />
            <Route path="/repo/:owner/:repo" element={<RepoExpandedPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App



