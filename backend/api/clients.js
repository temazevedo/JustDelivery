module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validations

  const save = async (req, res) => {
    const client = { ...req.body }

    if (req.params.id) client.id = req.params.id

    try {
      existsOrError(client.name, 'Name required')
      existsOrError(client.address, 'Address required')
      existsOrError(client.city, 'City required')
      existsOrError(client.gpsLat, 'GPS Latitude required')
      existsOrError(client.gpsLng, 'GPS Longitude required')
      existsOrError(client.phone, 'Phone number required')

    } catch (err) {
      return res.status(400).send(err)
    }

    if (client.id) {
      app.db('clients')
        .update(client)
        .where({ id: client.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))

    } else {
      app.db('clients')
        .insert(client)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }
  }

  const remove = async (req, res) => {
    try {
      const deletedClient = await app.db('clients').where({ id: req.params.id }).del()

      existsOrError(deletedClient, 'Client not found')

      res.status(204).send()
    } catch (err) {
      res.status(500).send(err)
    }
  }

  const getClients = (req, res) => {
    app.db('clients')
      .select('id', 'name', 'address', 'apartment', 'city', 'gpsLat', 'gpsLng', 'phone')
      .then(clients => res.json(clients))
      .catch(err => res.status(500).send(err))
  }

  const getClientById = (req, res) => {
    app.db('clients')
      .select('id', 'name', 'address', 'apartment', 'city', 'gpsLat', 'gpsLng', 'phone')
      .where({ id: req.params.id })
      .first()
      .then(client => res.json(client))
      .catch(err => res.status(500).send(err))
  }

  return { save, remove, getClientById, getClients }
}