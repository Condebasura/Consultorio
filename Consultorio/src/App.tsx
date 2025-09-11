
import './App.css'
import Libtn from './components/BtnLi'

function App() {
 // Crear un componente para el li
  return(
  <>
  <div className='caja row '>
    <div className='selector ps-0 pe-0 col-lg-1 m-0  vh-100'>
      
<Libtn className=' seccions list-group-item bg-primary p-1 text-white mt-2 ' name='Dashboard'/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Pacientes'/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Turnos'/>

    
    </div>
    <div className='inputs col-lg-11  border border-2 bg-white vh-100 '>
Inputs
    </div>

  </div>
  </>
 )
}

export default App
