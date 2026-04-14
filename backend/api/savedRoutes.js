module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validations

  const save = async (req, res) => { // always new route - no update
    const route = { ...req.body }

    try {
      // should work directly because everything is filled automaticaly
      existsOrError(route.clientsId_array, 'Clients required')
      existsOrError(route.route, 'Route required')
      //existsOrError(route.date, 'Date required')

    } catch (err) {
      console.error(err)
      return res.status(400).send(err)
    }
    route.date = new Date()

    app.db('saved_routes')
      .insert(route)
      .then(_ => res.status(204).send())
      .catch(err => { console.error(err)
        res.status(500).send(err)})
  }

  const remove = async (req, res) => {
    try {
      const deletedRoute = await app.db('saved_routes').where({ id: req.params.id }).del()

      existsOrError(deletedRoute, 'Route not found')

      res.status(204).send()
    } catch (err) {
      res.status(500).send(err)
    }
  }

  const getRoutes = (req, res) => {
    app.db('saved_routes')
      .select('id', 'clientsId_array', 'route', 'date')
      .then(routes => res.json(routes))
      .catch(err => res.status(500).send(err))
  }

  const getRouteById = (req, res) => {
    app.db('saved_routes')
      .select('id', 'clientsId_array', 'route', 'date')
      .where({ id: req.params.id })
      .then(route => res.json(route))
      .catch(err => res.status(500).send(err))
  }

  const checkExistingRoutes = (req, res) => {
    // check if clients points already exists and return route, before calculate new route
    const clients_array = { ...req.body }

    app.db('saved_routes')
      .select('id', 'clientsId_array', 'route', 'date')
      .where({ clientsId_array: clients_array })
      .then(route => res.json(route))
      .catch(err => res.status(500).send(err))
  }

  return { save, remove, getRoutes, getRouteById, checkExistingRoutes }
}