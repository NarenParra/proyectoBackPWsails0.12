/**
 * ContratoController
 *
 * @description :: Server-side logic for managing Contratoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {

    Servicio.obtener(Contrato)
      .then(function (ff) {
        res.send(ff)
      })
      .catch(function (err) {
        return res.serverError(err);
      });

    //  Contrato.find()
    //    .then(function (variables) {
    //      if (!variables || variables.length == 0) {
    //        return res.send({
    //          success: false,
    //          message: "No records fund (contratos)"
    //        });
    //      }
    //      return res.send({
    //        success: true,
    //        message: "Records fetched",
    //        data: variables
    //      });
    //    })
    //    .catch(function (err) {
    //      sails.log.debug(err);
    //      return (
    //        res.
    //        send({
    //          success: false,
    //          message: "Uneable fetch records"
    //        })
    //      );
    //    });
  },
  create: function (req, res) {

    Estado.findOne({
        titulo: req.param("estado")
      })
      .then((estado) => {

        if (typeof estado == 'object') {
          //sails.log.debug(req.param("titulo"), estado.id);

          Contrato.create({
              estado: estado.id,
              observaciones: req.param('observaciones'),
              valor: req.param('valor'),
              fechainicia: req.param('fechainicia'),
              contratoCiudad: req.param('contratoCiudad')
            })
            .then(function (contrato) {

              Servicio.crearEtiquetaObjeto(req.param('slug'), contrato.id)
                .then(function (ff) {
                  

                }).catch(function (err) {
                  return res.serverError(err);
                })
                // falta meter articulos, este se puede utilizar en otro
                .then(function (ff) {

                  Servicio.crearContratoArticulo(req.param('slugArt'), contrato.id)
                    .then(function (gg) {
                      res.send(gg)
                    })
    
                })
                .catch(function (err) {
                  return res.serverError(err);
                })

            })
            .catch(err => {
              return res.send({
                success: false,
                massage: "An Error in Register general",
                'err': err
              });
            })

        } else {
          return res.send({
            success: true,
            massage: "Estado no Foundd",
            'err': err
          });
        }
      })
      .catch(err => {
        return res.send({
          success: true,
          massage: "Estado no Found  ",
          'err': err
        });
      })
  }
};

// create: function (req, res) {
//   sails.log.debug(req.allParams());

//   Estado.findOne({
//       titulo: req.param("estado")
//     })
//     .then((estado) => {
//       if (typeof estado == 'object') {
//         //buscar usuario 


//         Contrato.create({estado:estado.id,observaciones:req.param('observaciones'),valor:req.param('valor'),fechainicia:req.param('fechainicia'),contratoCiudad:req.param('contratoCiudad')})
//           .then(function (contrato) {
//             // create etiqueta
//             Etiqueta.findOne({
//               slug: req.param("slug")
//             })
//             .then((etiqueta) => {

//               if (typeof etiqueta == 'object') {
//                 //sails.log.debug(req.param("titulo"), estado.id);
//                 sails.log.debug(contrato.id);
//                 ContratoEtiqueta.create({etiqueta:etiqueta.id,contrato:contrato.id})
//                   .then(function (contratoetiqueta) {
//                     return res.send({
//                       success: true,
//                       massage: "Creado Correctamente "
//                     });
//                   })
//                   .catch(err => {
//                     return res.send({
//                       success: false,
//                       massage: "An Error in Register",
//                       'err': err
//                     });
//                   })
//               } else {
//                 return res.send({
//                   success: true,
//                   massage: "Estado no Founddd",
//                   'err': err
//                 });
//               }
//             })
//             .catch(err => {
//               return res.send({
//                 success: true,
//                 massage: "Etiqueta no Found  ",
//                 'err': err
//               });
//             });
//             // return res.send({
//             //   success: true,
//             //   massage: "Creado Correctamente "
//             // });
//           })
//           .catch(err => {Contrato
//             return res.send({
//               success: false,
//               massage: "An Error in Register",
//               'err': err
//             });
//           })
//       } else {
//         return res.send({
//           success: true,
//           massage: "Estado no Founddd",
//           'err': err
//         });
//       }
//     })
//     .catch(err => {
//       return res.send({
//         success: true,
//         massage: "Estado no Found  ",
//         'err': err
//       });
//     })
// }
//};
