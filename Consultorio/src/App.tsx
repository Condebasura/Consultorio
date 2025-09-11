
import './App.css'
import Libtn from './components/BtnLi'

function App() {
 // Crear un componente para el li
  return(
  <>
  <div className='caja row '>
    <div className='selector ps-0  col-lg-1 m-0  vh-100'>
      
<Libtn className=' seccions list-group-item bg-primary p-1 text-white mt-2 ' name='Dashboard'/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Pacientes'/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Turnos'/>

    
    </div>
    <div className='inputs row col-lg-11  border border-2   vh-100 '>
 <div className=' shadow  col-lg-12 m-2 bg-white '>
  
 </div>
 <div className=' shadow col-lg-3 ms-2 bg-white'></div>
 <div className=' shadow col-lg-8 ms-2 bg-white '></div>
    </div>

  </div>
  </>
 )
}

export default App
