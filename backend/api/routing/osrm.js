// package to calculate the distance matrix

const axios = require('axios')

const OSRM_BASE = 'https://router.project-osrm.org'

const getDistanceMatrix = async (points, profile = 'driving') => {
  const coords = points.map(p => `${p.lng},${p.lat}`).join(';')

  const url = `${OSRM_BASE}/table/v1/${profile}/${coords}?annotations=distance`
  
  const { data } = await axios.get(url)

  if (!data.distances) {
    throw new Error('Error getting the distance matrix')
  }

  return data.distances
}


const getRouteGeometry = async (points, profile = 'driving') => {

  const coords = points.map(p => `${p.lng},${p.lat}`).join(';')

  const url = `${OSRM_BASE}/route/v1/${profile}/${coords}?geometries=geojson&overview=full`

  const { data } = await axios.get(url)

  return data.routes[0]
}


module.exports = { getDistanceMatrix, getRouteGeometry }