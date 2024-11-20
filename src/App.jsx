import { Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth
import ProtectedRoute from './components/ProtectedRoute';
import Animal from './pages/Animal';
import AnimalLists from './pages/AnimalLists';
import EditAnimal from './pages/EditAnimal';
import AddAnimal from './pages/AddAnimal';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthProvider>
      <div>
      <nav className='navbar navbar-dark bg-primary'>
          <div className='container-fluid d-flex align-items-center'>
            {/* Logo and Title */}
            <div className='d-flex align-items-center'>
              <img
                src='/capstone-project/grazioso_salvare_logo_white.png' // accounts for base in gh-pages deployment
                alt='Grazioso Salvare Logo'
                style={{ height: '40px', marginRight: '10px' }}
              />
              <Link className='navbar-brand mb-0 h1' to='/'>
                Grazioso Salvare
              </Link>
            </div>
            
            {/* Login/Signup or Logout */}
            <div className='ms-auto d-flex'>
              {user ? (
                <button className='btn btn-light me-2' onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <>
                  <Link className='btn btn-light me-2' to='/login'>
                    Login
                  </Link>
                  <Link className='btn btn-light' to='/signup'>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <div>
          <Routes>
            {/* Public Routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <AnimalLists />
                </ProtectedRoute>
              }
            />
            <Route
              path='/animal/:id'
              element={
                <ProtectedRoute>
                  <Animal />
                </ProtectedRoute>
              }
            />
            <Route
              path='/animal/:id/edit'
              element={
                <ProtectedRoute>
                  <EditAnimal />
                </ProtectedRoute>
              }
            />
            <Route
              path='/add-animal'
              element={
                <ProtectedRoute>
                  <AddAnimal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;