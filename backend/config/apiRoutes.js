module.exports = app => {
  // ------------------------------------------------
  // clients
  app.route('/clients')
    .get(app.api.clients.getClients)
    .post(app.api.clients.save)
    
  app.route('/clients/:id')
    .get(app.api.clients.getClientById)
    .put(app.api.clients.save)
    .delete(app.api.clients.remove)

  // ------------------------------------------------
  // saved routes
  app.route('/routes')
    .get(app.api.savedRoutes.getRoutes)
    .post(app.api.savedRoutes.save)
    
  app.route('/routes/:id')
    .get(app.api.savedRoutes.getRouteById)
    .put(app.api.savedRoutes.save)
    .delete(app.api.savedRoutes.remove)

  app.route('/routes/check')
    .post(app.api.savedRoutes.checkExistingRoutes)

  // ------------------------------------------------
  // search and calculate route
  app.route('/map/search')
    .post(app.api.routeCalculator.searchOnMap)

  app.route('/map/calculate')
    .post(app.api.routeCalculator.calculateRoute)
  
  
}