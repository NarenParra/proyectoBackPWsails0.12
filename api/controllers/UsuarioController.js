/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  get: function (req, res) {

    Servicio.obtenerUoR(Usuario, req.param('idc'))
      .then(function (ff) {
        res.send(ff)
      })
      .catch(function (err) {
        return res.serverError(err);
      });
  },

  create: function (req, res) {

    Usuario.create({
        docid: req.param('user').doc,
        nombre: req.param('user').nomb,
        apellido: req.param('user').ape,
        tipodocid: req.param('user').tipo,
        email: req.param('user').email,
        direccion: req.param('user').direccion,
        tipopersona: req.param('user').persona,
        expediciondoc: req.param('user').expe
      }).then(function (usuario) {
        //console.log(usuario)
        if(usuario){
           return res.send({
            success: true,
            massage: "Creado Correctamente "
          });
        }else{
          return res.send({
            success: false,
            massage: "No Creado Correctamente "
          });
        }
         
      })
      .catch(function (err) {
        return res.serverError(err);
      });
  }
};
