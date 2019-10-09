/**
 * ContratoArticuloController
 *
 * @description :: Server-side logic for managing contratoarticuloes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get: function (req, res) {

        Servicio.obtenerUoR(ContratoUsuario,req.param('idc'))
          .then(function (ff) {
            res.send(ff)
          })
          .catch(function (err) {
            return res.serverError(err);
          });
      },
};

