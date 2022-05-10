import { setAuthVar, setPlaylistVar } from './services/sessionStorage'
import { GeneralPlaylist } from './pages/Playlists/GeneralPlaylist'
import { AllPlaylists } from './pages/Playlists/AllPlaylists'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SearchBar from './components/SearchBar/SearchBar'
import { getPlaylists, getUser } from './services/api'
import History from './pages/Playlists/History'
import Liked from './pages/Playlists/Liked'
import VideoPage from './pages/VideoPage'
import Channel from './pages/Channel'
import Profile from './pages/Profile'
import Result from './pages/Results'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Upload from './pages/Upload'
import { useEffect } from 'react'
import Home from './pages/Home'


function App() {
  useEffect(() => {
    getUser().then((data) => {
      setAuthVar(data)
      getPlaylists().then((data) => {
        setPlaylistVar(data)
      })
    }).catch((err) => {
      if (err.response && err.response.status !== 401) {
        alert('Unknown server Error')
      }
    })
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
      </header>  
  
      <BrowserRouter>
        <SearchBar />
        <Routes>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/video/:id' element={<VideoPage />} />
          <Route path='/home' element={<Home />} />
          <Route path='/results' element={<Result />} />
          <Route path='/history' element={<History/>} />
          <Route path='/liked' element={<Liked />} />
          <Route path='/playlists' element={<AllPlaylists />} />
          <Route path='/playlist/:id' element={<GeneralPlaylist />} />
          <Route path='/channel/:id' element={<Channel />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
