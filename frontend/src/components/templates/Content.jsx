import './Templates.css'
import { Outlet } from 'react-router'

function Content() {
  return (
    <div className="content">
      <h6>Please use side bar to access data</h6>
      <Outlet />
    </div>
  )

}

export default Content