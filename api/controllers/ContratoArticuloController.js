/**
 * ContratoArticuloController
 *
 * @description :: Server-side logic for managing contratoarticuloes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  get: function (req, res) {

    Servicio.obtenerCA(ContratoArticulo, req.param('idc'))
      .then(function (ff) {
        //res.send(ff)
        // console.log("articulos devieltos")
         console.log(ff)
        Servicio.findArticulo(ff.data.articulo).then(function (articulo) {
          res.send(articulo)
          console.log("articulo")
          console.log(articulo)

        })
      })
      .catch(function (err) {
        return res.serverError(err);
      });
  },
};
