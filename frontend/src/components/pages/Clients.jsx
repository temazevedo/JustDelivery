import "./Pages.css";
import axios from "axios";
import { baseApiUrl } from "../../global";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";

function Clients({clients}) {
  

  function notify(msg, type = "success") {
    if (type == "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }


  return (
    <>
      <ToastContainer autoClose={2000} />
      <Link to={"/clients/0"}>
        <Button className="action-btn">New</Button>
      </Link>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Apartment</th>
            <th>City</th>
            <th>Phone</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.address}</td>
              <td>{c.apartment}</td>
              <td>{c.city}</td>
              <td>{c.phone}</td>
              <td>
                <Link to={`/clients/${c.id}`}>
                  <Button>
                    <i className="fa fa-pencil"></i>
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Clients;
