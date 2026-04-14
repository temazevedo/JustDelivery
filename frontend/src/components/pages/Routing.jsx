import "./Pages.css";
import axios from "axios";
import { baseApiUrl } from "../../global";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";
import Accordion from "react-bootstrap/Accordion";

import RouteViewer from "../templates/RouteViewer";

function Routing({ clients, savedRoutes }) {
  const [tableClients, setTableClients] = useState([]);
  const [tableGPS, setTableGPS] = useState([]);
  const [centerCoords, setCenterCoords] = useState([41.551284, -8.416994]);

  const [driveRoute, setDriveRoute] = useState({});
  const [routeLoaded, setRouteLoaded] = useState(false);

  function notify(msg, type = "success") {
    if (type == "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }

  function getGPS(clientId) {
    for (let i = 0; i < clients.length; i++) {
      if (clientId == clients[i].id) {
        return {
          id: clients[i].id,
          lat: clients[i].gpsLat,
          lng: clients[i].gpsLng,
        };
      }
    }
  }

  function selectDelivery(clientId) {
    // add client to list
    if (!tableClients.includes(clientId)) {
      setTableClients((tableClients) => [...tableClients, clientId]);

      const coords = getGPS(clientId);

      setTableGPS((prev) => [...prev, coords]);
    } else {
      // unselect client from list
      setTableClients(tableClients.filter((client) => client !== clientId));
      setTableGPS(tableGPS.filter((client) => client.id !== clientId));
    }
  }

  async function calculateRoute() {
    setRouteLoaded(false);
    setDriveRoute({});

    //1 - search for existing saved route
    let found = false;
    const list = "" + tableClients.sort();

    for (let i = 0; i < savedRoutes.length && !found; i++) {
      if (savedRoutes[i].clientsId_array == list) {
        setDriveRoute({ ...savedRoutes[i].route });
        calculateCenterCoords();
        setRouteLoaded(true);
        notify("Saved Route found");
        found = true;
      }
    }

    if (!found) {
      notify("Saved Route not found, calculating...");

      const calculateBody = { points: tableGPS };

      await axios
        .post(`${baseApiUrl}/map/calculate`, calculateBody)
        .then((res) => {
          setDriveRoute(res.data);
          calculateCenterCoords();
          setRouteLoaded(true);
        })
        .catch((err) => notify(err.response?.data, "error"));
    }
  }

  function calculateCenterCoords() {
    const allLat = [];
    const allLng = [];

    tableGPS.map((gps) => {
      allLat.push(Number(gps.lat));
      allLng.push(Number(gps.lng));
    });

    const centerLat = allLat.reduce((sum, acc) => sum + acc, 0) / allLat.length;
    const centerLng = allLng.reduce((sum, acc) => sum + acc, 0) / allLng.length;

    setCenterCoords([centerLat, centerLng]);
  }

  function selectAllClientsForDelivery() {
    const allClients = [];
    const allGPS = [];

    clients.forEach((client) => {
      allClients.push(client.id);
      allGPS.push({
        id: client.id,
        lat: client.gpsLat,
        lng: client.gpsLng,
      });
    });

    setTableClients([...allClients]);
    setTableGPS([...allGPS]);
  }

  function unselectAllClientsForDelivery() {
    setTableClients([]);
    setTableGPS([]);
  }

  async function saveRoute() {
    const body = {
      clientsId_array: "" + tableClients.sort(),
      route: JSON.stringify(driveRoute),
    };
    await axios
      .post(`${baseApiUrl}/routes`, body)
      .then((res) => notify("Route saved"))
      .catch((err) => notify(`Error saving route: ${err.response?.data}`));
  }

  return (
    <>
      <ToastContainer autoClose={2000} />
      <h4>Routing</h4>

      {tableClients.length != clients.length ? (
        <Button className="action-btn" onClick={selectAllClientsForDelivery}>
          Select All
        </Button>
      ) : (
        <Button className="action-btn" onClick={unselectAllClientsForDelivery}>
          Unselect All
        </Button>
      )}
      {tableClients.length >= 2 && (
        <Button className="action-btn" onClick={calculateRoute}>
          Calculate Route
        </Button>
      )}

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Clients: {clients.length}</Accordion.Header>
          <Accordion.Body>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Apartment</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.address}</td>
                    <td>{c.apartment}</td>
                    <td>{c.city}</td>
                    <td>{c.phone}</td>
                    <td>
                      <Button onClick={() => selectDelivery(c.id)}>
                        {tableClients.includes(c.id) ? (
                          <i className="fa fa-check-square-o"></i>
                        ) : (
                          <i className="fa fa-square-o"></i>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <hr />
      {routeLoaded && 
        <>
          <Button onClick={saveRoute}>Save Route</Button>
          <RouteViewer
            routeInfo={driveRoute}
            markers={tableGPS}
            centerCoords={centerCoords}
          />
        </>
      }
    </>
  );
}

export default Routing;
