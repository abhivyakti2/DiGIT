import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SearchBar from './features/search/SearchBar'
import HomeInfo from './componenets/HomeInfo'
import Logo from './componenets/Logo'
import SearchResults from './features/search/SearchResults'
import UserExpandedProfile from './features/user/UserExpandedProfile'
import RepoExpandedPage from './features/repo/RepoExpandedPage'
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('all')

  const handleSearch = (q, type) => {
    setSearchTerm(q)
    setSearchType(type)
  }

  return (
    
      <div>
        <Logo />
        <SearchBar onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={
            searchTerm
              ? <SearchResults query={searchTerm} type={searchType} />
              : <HomeInfo />
          } />
          <Route path="/profile/:username" element={<UserExpandedProfile />} />
          <Route path="/repo/:owner/:repo" element={<RepoExpandedPage />} />
        </Routes>
      </div>
  )
}

export default App
