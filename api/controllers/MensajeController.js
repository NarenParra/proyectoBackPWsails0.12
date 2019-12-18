/**
 * MensajeController
 *
 * @description :: Server-side logic for managing mensajes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  get: function(req, res) {
    Mensaje.find({
      contrato: req.param("idc")
    })
      .sort({
        $natural: -1
      })
      .exec((err, mensaje) => {
        if (err) {
          res.serverError(err);
        }
        if (mensaje == 0) {
          res.send({
            success: false,
            massage: "Mensaje no Found "
          });
        } else {
          res.send({
            success: true,
            massage: "Mensaje Found ",
            data: mensaje
          });
        }
      });
  },
  create: function(req, res) {
    Mensaje.create({
      titulo: req.param("titulo"),
      descripcion: req.param("descripcion"),
      hora: req.param("hora"),
      fecha: req.param("fecha"),
      contrato: req.param("contrato")
    })
      .then(function(mensaje) {
        if (mensaje) {
          return res.send({
            success: true,
            massage: "Creado Correctamente "
          });
        } else {
          return res.send({
            success: false,
            massage: "No Creado Correctamente "
          });
        }
      })
      .catch(function(err) {
        return res.serverError(err);
      });
  },

};
