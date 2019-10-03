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
  },

  create: function (req, res) {

    Estado.findOne({
        titulo: req.param("estado")
      })
      .then((estado) => {

        if (typeof estado == 'object') {
          //sails.log.debug(req.param("titulo"), estado.id);
          Usuario.findOne({
            docid: req.param("usuario")
          }).then((usuario) => {
            sails.log.debug(usuario)
            Contrato.create({
                estado: estado.id,
                observaciones: req.param('observaciones'),
                valor: req.param('valor'),
                fechainicia: req.param('fechainicia'),
                contratoCiudad: req.param('contratoCiudad'),
                usuario: usuario.id
              })
              .then(function (contrato) {
                Servicio.crearContratoEtiqueta(req.param('slugObj'), contrato.id, 0, "", "", "")
                  .then(function (fce) {
                    Servicio.crearContratoArticulo(req.param('slugArt'), contrato.id, fce.id, contrato.valor)
                      .then(function (fca) {
                        //res.send(fca)
                      })

                  }).catch(function (err) {
                    return res.serverError(err);
                  })
                  .then(function (ff) {
                    Servicio.crearContratoEtiqueta(req.param('slugPre'), contrato.id, contrato.valor, req.param('valorletra'), "", req.param('descripcion'))
                      .then(function (fca) {
                        // res.send(fca)
                      })

                  }).then(function (ff) {
                    Servicio.crearContratoEtiqueta(req.param('slugAcep'), contrato.id, 0, "", contrato.fechainicia, req.param('lugarContrato'))
                      .then(function (fca) {
                        res.send(fca)
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

          }).catch(err => {
            return res.send({
              success: true,
              massage: "Usuario no Found ",
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
