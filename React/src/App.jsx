import { Route, Routes, Link } from 'react-router-dom'
import Animal from './pages/Animal'
import AnimalLists from './pages/AnimalLists'
import EditAnimal from './pages/EditAnimal'
import AddAnimal from './pages/AddAnimal';

function App() {
  
  return (
    <div>
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <Link className='navbar-brand' to="/">
            Animal Shelter App
          </Link>
        </div>
      </nav>

      <div>
        <Routes>
          <Route path='/' element={<AnimalLists />}/>
          <Route path='/animal/:id' element={<Animal />}/>
          <Route path='/animal/:id/edit' element={<EditAnimal />}/>
          <Route path='/add-animal' element={<AddAnimal />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
