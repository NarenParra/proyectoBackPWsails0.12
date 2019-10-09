/**
 * ContratoUsuarioController
 *
 * @description :: Server-side logic for managing contratousuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {

    Servicio.obtenerP(ContratoUsuario,req.param('idc'))
      .then(function (ff) {
        res.send(ff)
      })
      .catch(function (err) {
        return res.serverError(err);
      });
  },
}
