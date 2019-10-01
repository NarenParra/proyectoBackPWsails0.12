/**
 * ContratoEtiquetaController
 *
 * @description :: Server-side logic for managing contratoetiquetas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res) {
        sails.log.debug(req.allParams());
    
        Etiqueta.findOne({
            slug: req.param("etiqueta")
          })
          .then((etiqueta) => {
            var parametros = req.allParams();
            sails.log.debug(parametros);
            if (typeof etiqueta == 'object') {
              //sails.log.debug(req.param("titulo"), estado.id);
              parametros.etiqueta = etiqueta.id;
              sails.log.debug(parametros);
              ContratoEtiqueta.create(parametros)
                .then(function (coontratoetiqueta) {
                  return res.send({
                    success: true,
                    massage: "Creado Correctamente "
                  });
                })
                .catch(err => {
                  return res.send({
                    success: false,
                    massage: "An Error in Register",
                    'err': err
                  });
                })
            } else {
              return res.send({
                success: true,
                massage: "Estado no Founddd",
                'err': err
              });
            }
          })
          .catch(err => {
            return res.send({
              success: true,
              massage: "Etiqueta no Found  ",
              'err': err
            });
          });
      }
};

