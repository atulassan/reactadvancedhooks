import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/modules/MainLayout';
import Posts from './pages/Posts';
import UserPosts from './pages/UserPosts';
import Post from './pages/Post';
import UseBatchHook from './pages/UseBatchHook';
import VirtualizedList from './pages/Virtualization';

const Loader = () => <div className='p-4 text-center'>Loading....</div>

function App() {

  return (
     <>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Posts />} />
                <Route path="userposts/:userId" element={<UserPosts />} />
                <Route path="post/:postId" element={<Post />} />
                <Route path="usebatchook" element={<UseBatchHook />} />
                <Route path="virtualization" element={<VirtualizedList />} />
              </Route>    
            </Routes>    
          </Suspense>
        </BrowserRouter>
     </>
  )
}

export default App
