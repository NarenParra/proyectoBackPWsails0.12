/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  
    get: function (req, res) {

        Servicio.obtenerUoR(Usuario,req.param('idc'))
          .then(function (ff) {
            res.send(ff)
          })
          .catch(function (err) {
            return res.serverError(err);
          });
      },
      post: function(req,res){
        Usuario.create({
          docid:req.param('docid'),
          nombre: req.param('nombre'),
          tipodocid: req.param('tipodoc')
        }).then(function(usuario){
            console.log(usuario)
        })
        .catch(function (err) {
          return res.serverError(err);
        });
    }
};

