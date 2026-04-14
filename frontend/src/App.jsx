import './App.css'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { baseApiUrl } from './global'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router'
import { ToastContainer, toast } from "react-toastify";

// components
import Header from './components/templates/Header'
import Footer from './components/templates/Footer'
import Content from './components/templates/Content'
import SideBar from './components/templates/SideBar'
import Clients from './components/pages/Clients'
import ClientDetail from './components/pages/ClientDetail'
import Routing from './components/pages/Routing'

function App() {
  const [clients, setClients] = useState([])
  const [savedRoutes, setSavedRoutes] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    console.log("loading")
    setTimeout(() => {
    
      loadSavedRoutes()
      loadClients()
    }, 2000); // just to simulate some time while loading
  }, [])

  
  function notify(msg, type = "success") {
      if (type == "error") {
        toast.error(msg);
      } else {
        toast.success(msg);
      }
    }
  

  async function loadClients() {
    await axios.get(`${baseApiUrl}/clients`)
      .then(res => {
        setClients(res.data)
        setDataLoaded(true)
      })
      .catch(err => notify(`Error loading clients: ${err.response?.data}`))
  } 

  async function loadSavedRoutes() {
    await axios
      .get(`${baseApiUrl}/routes`)
      .then((res) => {
        const parsedRoutes = [];
        res.data.forEach((r) => {
          parsedRoutes.push({
            id: r.id,
            clientsId_array: r.clientsId_array,
            date: r.date,
            route: JSON.parse(r.route),
          });
        });
        setSavedRoutes([...parsedRoutes])
      })
      .catch((err) =>
        notify(`Error loading saved routes: ${err.response?.data}`),
      );
  }




  return (
      <Router>
        <ToastContainer autoClose={2000} />
        <div id="app">
          <Header />
          <SideBar />
          {dataLoaded ? (
            <>
            
  
            <Routes>
              <Route path='/' element={<Content clients={clients}/>} >
                <Route path='/clients' element={<Clients clients={clients} />}/>
                <Route path='/clients/:id' element={<ClientDetail clients={clients} updateClients={loadClients}/>}/>
              
                <Route path='/routes' element={<Routing clients={clients} savedRoutes={savedRoutes}/>} />
              </Route>
            </Routes>
            <Footer />          
            </>
            
          ) : (
            <h4>Data not loaded yet</h4>
          )}
          </div>
      </Router>
  )
}

export default App
