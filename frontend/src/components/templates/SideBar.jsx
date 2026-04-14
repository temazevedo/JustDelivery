import './Templates.css'

import {Link} from 'react-router'
import Button from 'react-bootstrap/esm/Button'

function SideBar() {

  return (<>
  <div className="side-bar">
  
  <Link to={'/clients'}>
    <Button className='side-bar-btn'>
      <i className='fa fa-user'></i>
      Clients
    </Button>
  </Link>

  

  <Link to={'/routes'}>
    <Button className='side-bar-btn'>
      <i className='fa fa-map-o'></i>
      Calculate Route
    </Button>
  </Link>

  </div>
  </>)
}

export default SideBar