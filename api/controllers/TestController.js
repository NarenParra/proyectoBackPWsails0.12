/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {

    var makeget = Servicio.mostrar(Rol);
    res.send(makeget);
  },

//   index: function (req, res) {

//     // Gets hello message from service
//     var helloMessage = Servicio.sayHello('mensaje');

//     // Returns hello message to screen
//     res.send('Our service has a message for you: ' + helloMessage);
//   }


};
