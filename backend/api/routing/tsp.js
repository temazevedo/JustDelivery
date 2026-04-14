// package to calculate best route using closed TSP (nearest neighbor + 2-opt)

function totalDistance(route, matrix) {
  let d = 0
  for (let i = 0; i < route.length -1; i++) {
    d += matrix[route[i]][route[i + 1]]
  }
  return d
}

function nearestNeighbor(matrix) {
  const n = matrix.length
  const visited = Array(n).fill(false)
  const route = [0] 
  visited[0] = true

  for (let i = 1; i < n; i++) {
    const last = route[route.length - 1]
    let next = -1
    let best = Infinity

    for (let j = 0; j < n; j++) {
      if (!visited[j] && matrix[last]?.[j] < best) {
        best = matrix[last][j]
        next = j
      }
    }

    route.push(next)
    visited[next] = true
  }

  return route
}

function twoOpt(route, matrix) {
  let improved = false

  while (improved) {
    improved = false

    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const newRoute = [...route]
        newRoute.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse())

        if (totalDistance(newRoute, matrix) < totalDistance(route, matrix)) {
          route = newRoute
          improved = true
        }
      }
    }
  }

  return route
}


function solveTSP(matrix) {
  let route = nearestNeighbor(matrix)
  route = twoOpt(route, matrix)
  return route
}



module.exports = solveTSP 