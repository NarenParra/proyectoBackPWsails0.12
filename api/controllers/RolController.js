/**
 * RolController
 *
 * @description :: Server-side logic for managing rols
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get: function (req, res) {

        Servicio.obtenerUoR(Rol,req.param('idc'))
          .then(function (ff) {
            res.send(ff)
          })
          .catch(function (err) {
            return res.serverError(err);
          });
      },
};

