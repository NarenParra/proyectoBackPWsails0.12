/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {
     
    //sails.log.debug(makeget);
    Servicio.obtener(Rol)
    .then(function (ff){
      res.send(ff)
    })
    .catch(function (err) { return res.serverError(err); });
      
  },

  create: function (req, res) {

  }
  //   index: function (req, res) {

  //     // Gets hello message from service
  //     var helloMessage = Servicio.sayHello('mensaje');

  //     // Returns hello message to screen
  //     res.send('Our service has a message for you: ' + helloMessage);
  //   }


};
