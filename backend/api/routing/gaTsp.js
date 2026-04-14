// genetic algorythm if number of points > 10

function totalDistance(route, matrix) {
  let d = 0
  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i]
    const b = route[i + 1]

    if (
      a == null ||
      b == null ||
      matrix[a] == null ||
      matrix[a][b] == null
    ) {
      return
    }

    d += matrix[a][b]
  }
  return d
}

// creates random route keeping origin fixed
function randomRoute(n) {
  const middle = []
  for (let i = 1; i < n; i++) middle.push(i)

  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[middle[i], middle[j]] = [middle[j], middle[i]]
  }

  return [0, ...middle, 0]
}

// selection by tournament
function tournament(pop, matrix, k = 3) {
  let best = null
  for (let i = 0; i < k; i++) {
    const ind = pop[Math.floor(Math.random() * pop.length)]
    if (!best || totalDistance(ind, matrix) < totalDistance(best, matrix)) {
      best = ind
    }
  }

  return best
}

// ordered crossover (OX)
function crossover(a, b) {
  const size = a.length - 2
  const start = 1 + Math.floor(Math.random() * size)
  const end = start + Math.floor(Math.random() * (size - start))

  const child = Array(a.length).fill(null)
  child[0] = child[child.length - 1] = 0

  for (let i = start; i <= end; i++) {
    child[i] = a[i]
  }

  let idx = 1
  for (let i = 1; i < b.length - 1; i++) {
    if (!child.includes(b[i])) {
      while (child[idx] !== null) idx++
      child[idx] = b[i]
    }
  }

  return child
}

// simple swap
function mutate(route) {
  const i = 1 + Math.floor(Math.random() * (route.length - 2));
  const j = 1 + Math.floor(Math.random() * (route.length - 2));
  [route[i], route[j]] = [route[j], route[i]];
}

function solveTSP_GA(matrix, opts = {}) {
  const {
    populationSize = 200,
    generations = 500,
    mutationRate = 0.03,
    elitism = 2
  } = opts

  const n = matrix.length
  let population = Array.from({ length: populationSize }, () => randomRoute(n))

  for (let gen = 0;gen<generations;gen++) {
    population.sort(
      (a,b) => totalDistance(a, matrix) - totalDistance(b,matrix)
    )
  
    const newPop = population.slice(0,elitism)

    while(newPop.length < populationSize) {
      const p1 = tournament(population, matrix)
      const p2 = tournament(population, matrix)
      let child = crossover(p1,p2)

      if (Math.random() < mutationRate) mutate(child)

      newPop.push(child)
    }

    population = newPop  
  }

  population.sort(
    (a,b) => totalDistance(a,matrix) - totalDistance(b,matrix)
  )

  return population[0]
}

module.exports = solveTSP_GA