/**
 * MensajeController
 *
 * @description :: Server-side logic for managing mensajes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {
  Mensaje.find({
    contrato:req.param('idc')
  }).sort({
      $natural: -1
    }).exec((err, mensaje) => {
      if (err) {
        res.serverError(err)
      }
      if (mensaje == 0) {
        res.send({
          success: false,
          massage: "Mensaje no Found ",
        })
      } else {
        res.send({
          success: true,
          massage: "Mensaje Found ",
          data:mensaje
        })
      }
    })
  },
};
