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
    <>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center', // vertical alignment
          justifyContent: 'flex-start', // logo stays left
          padding: '16px 24px 0 24px',
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <Logo/>
        
        {/* Only show search bar inline on non-home pages */}
        {!isHomePage && (
          <div style={{ marginLeft: '340px', marginTop: '-50px', flex: 1 }}>
            <SearchBar inline />
          </div>
        )}
      </div>

      {/* Page content */}
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: `${isSearchPage ? '0px' : isHomePage ? '160px' : '24px'} 16px 0`
        }}
      >
        {/* Centered search bar on homepage */}
        {isHomePage && <SearchBar />}

        <div style={{ marginTop: isHomePage ? '40px' : '20px' }}>
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
    </>
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



