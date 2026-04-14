import "./Pages.css";

import axios from "axios";
import { baseApiUrl } from "../../global";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import MapViewer from "../templates/MapViewer";

function ClientDetail({updateClients}) {
  const params = useParams();
  const navigate = useNavigate();

  const emptyClient = {
    id: "",
    name: "",
    address: "",
    apartment: "",
    city: "",
    gpsLat: "",
    gpsLng: "",
    phone: "",
  };

  const [client, setClient] = useState({ ...emptyClient });
  const [clientEdit, setClientEdit] = useState({ ...emptyClient });

  const [mapPoint, setMapPoint] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false)

  useEffect(() => {
    loadClient();
  }, []);

  useEffect(() => {
    setClientEdit({...client})
  },[client])

  async function loadClient() {
    if (params.id == 0) {
      // do nothing
    } else {
      await axios
        .get(`${baseApiUrl}/clients/${params.id}`)
        .then((res) => {
          setClient(res.data);
          setClientEdit(res.data)
          notify("Client loaded");
        })
        .catch((err) => notify(err.response?.data, "error"));
    }
  }

  async function save() {
    const method = params.id == 0 ? "post" : "put";
    const clientId = params.id == 0 ? "" : `/${params.id}`;

    if (params.id == 0) {
      delete clientEdit.id;
    }

    await axios[method](`${baseApiUrl}/clients${clientId}`, clientEdit)
      .then((_) => {
        notify("Client saved")
        updateClients()
        setTimeout(() => {
          navigate("/clients")
        }, 2000);
      })
      .catch((err) => notify(err.response?.data, "error"));
  }

  async function remove() {
    await axios
      .delete(`${baseApiUrl}/clients/${params.id}`)
      .then((_) => {
        notify("Client deleted");
        updateClients()
        setTimeout(() => {
          navigate("/clients");
        }, 2000);
      })
      .catch((err) => notify(err.response?.data, "error"));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setClientEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function notify(msg, type = "success") {
    if (type == "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }

  function reset() {
    setClientEdit({ ...client });
  }

  function updateMarkerFromMap(position) {
    setClientEdit((prev) => ({
      ...prev,
      gpsLat: position[0],
      gpsLng: position[1],
    }));
  }

  async function searchOnMap() {
    if (params.id == 0) {
      // no gps saved, search
      const body = { street: clientEdit.address, city: clientEdit.city };
      setShowMap(false);
      setLoadingMap(true)

      await axios.post(`${baseApiUrl}/map/search`, body)
        .then((res) => {
          setMapPoint([res.data[1], res.data[0]]);
          setClientEdit((prev) => ({
            ...prev,
            gpsLat: res.data[1],
            gpsLng: res.data[0],
          }));
          setShowMap(true);
          setLoadingMap(false)
        })
        .catch((err) => {
          notify(err.response?.data, "error")
          setLoadingMap(false)
        });
    } else {
      //gps saved, show on map
      setMapPoint([client.gpsLat, client.gpsLng]);
      setShowMap(true);
    }
  }

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Button className="action-btn" onClick={save}>
        Save
      </Button>
      {
        params.id != 0 &&
      <Button className="action-btn" onClick={remove}>
        Remove
      </Button>
      }
      <Button className="action-btn" onClick={reset}>
        Cancel
      </Button>
      <hr />
      <Form>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                required
                value={clientEdit.name}
                onChange={handleChange}
                name="name"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                required
                value={clientEdit.city}
                onChange={handleChange}
                name="city"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Phone"
                required
                value={clientEdit.phone}
                onChange={handleChange}
                name="phone"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                required
                value={clientEdit.address}
                onChange={handleChange}
                name="address"
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Apartment</Form.Label>
              <Form.Control
                type="text"
                placeholder="(Optional)"
                value={clientEdit.apartment}
                onChange={handleChange}
                name="apartment"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                disabled
                placeholder="GPS Latitude"
                value={clientEdit.gpsLat}
                onChange={handleChange}
                name="gpsLat"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                disabled
                placeholder="GPS Longitude"
                value={clientEdit.gpsLng}
                onChange={handleChange}
                name="gpsLng"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <hr />
      <Button className="action-btn" onClick={save}>
        Save
      </Button>
      {params.id > 0 && (
        <Button className="action-btn" variant="danger" onClick={remove}>
          Delete
        </Button>
      )}
      <Button className="action-btn" onClick={reset}>
        Cancel
      </Button>
      <hr />
      <Button className="map-btn" onClick={searchOnMap} disabled={loadingMap}>
        Show Map
      </Button>
      <div className="map-viewer">
        {showMap && (
          <MapViewer point={mapPoint} updateMarker={updateMarkerFromMap} />
        )}
      </div>
    </>
  );
}

export default ClientDetail;
