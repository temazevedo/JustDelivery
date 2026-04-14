const axios = require('axios')
const {openMapsKey} = require('../.env')

module.exports = app => {
  const { getDistanceMatrix, getRouteGeometry } = require('./routing/osrm')
  const solveTSP = require('./routing/tsp')
  const solveTSP_GA = require('./routing/gaTsp')

  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validations

  const calculateRoute = async (req, res) => {
    try {
      const { points, profile = 'driving' } = req.body

      if (!points || points.length < 2) {
        return res.status(400).json('Minimum 2 points required')
      }

      
      const matrix = await getDistanceMatrix(points, profile)

      let order
      if (points.length <= 10) {
        order = solveTSP(matrix)
      } else {
        order = solveTSP_GA(matrix)
      }

      const orderedPoints = order.map(i => points[i])
      const route = await getRouteGeometry(orderedPoints, profile)

      res.json({
        order,
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry
      })

    } catch (err) {
      res.status(500).send('Error calculating route')
    }
  }

  const searchOnMap = async (req, res) => { 
    const {street, city} = req.body

    try {
      existsOrError(street, 'Address required')
      existsOrError(city, 'City required')

    } catch(err) {
      res.status(400).send(err)
    }

    const address = `${street}, ${city}`
    const country = 'PT' // Portugal

    await axios.get(`https://api.openrouteservice.org/geocode/search?api_key=${openMapsKey}&text=${address}&boundary.country=${country}`)
      .then(gps => {
        const gpsPoints = gps.data.features[0].geometry.coordinates
        res.json(gpsPoints)
      })
      .catch(err => res.status(500).send(err))
  }

  return { calculateRoute, searchOnMap }
}