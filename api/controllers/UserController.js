/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get: function (req, res) {

        Servicio.obtenerU(Usuario,req.param('idc'))
          .then(function (ff) {
            res.send(ff)
          })
          .catch(function (err) {
            return res.serverError(err);
          });
      },

    post: function(req,res){
        Usuario.create({

        }).then(function(usuario){
            console.log(usuario)
        })
    }
};

