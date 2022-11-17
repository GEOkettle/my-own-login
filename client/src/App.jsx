import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Auth from './components/hoc/auth'
import Sign from './components/Sign';
import Landing from './components/Landing';
import Test3 from './components/Test3'
import Admin from './components/Admin'


function App() {

    const AuthSign = Auth(Sign, false);
    const AuthLanding = Auth(Landing, true);
    const AuthAdmin = Auth(Admin,true,true)

    return (
      <>
          <Routes >
        <Route path='*' element={<AuthSign />} />
        <Route path='/test1' element={<AuthSign />} />
        <Route path='/landing' element={<AuthLanding />} />
        {/* <Route path='/test3' element={<Test3 />} /> */}
        <Route path='/admin' element={ <AuthAdmin/>} />
        </Routes>
      </>
  )
}

export default App
