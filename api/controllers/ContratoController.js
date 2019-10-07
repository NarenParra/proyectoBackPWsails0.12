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
        slug: req.param("estado")
      })
      .then((estado) => {

     // sails.log.debug(req.param("userlog"));
        Usuario.findOne({
          docid: req.param("userlog")
        }).then((usuariolog) => {

           Usuario.findOne({
               docid: req.param("usercomp")
             }).then((usuariocom) => {

              var idusercom = null;
              var valorv = null;
              if(typeof usuariocom =='object' && estado.slug=='borrador'){
                idusercom =usuariocom.id
              }

              Contrato.create({
                  estado: estado.id,
                  observaciones: req.param('observaciones'),
                  valor: req.param('valor'),
                  fechainicia: req.param('fechainicia'),
                  contratoCiudad: req.param('contratoCiudad'),
                  usuario: idusercom,
                  creador: usuariolog.id
                })
                .then(function (contrato) {

                  Servicio.crearContratoEtiqueta(req.param('slugObj'), contrato.id, 0, "", "", "")
                    .then(function (fce) {
                      Servicio.crearContratoArticulo(req.param('slugArt'), contrato.id, fce.id, contrato.valor)
                        .then(function (fca) {})
                    })

                    .then(function (ff) {
                      Servicio.crearContratoEtiqueta(req.param('slugPre'), contrato.id, contrato.valor, req.param('valorletra'), "", req.param('descripcion'))
                        .then(function (fce) {})

                    }).then(function (ff) {
                      Servicio.crearContratoEtiqueta(req.param('slugAcep'), contrato.id, 0, "", contrato.fechainicia, req.param('lugarContrato'))
                        .then(function (fcac) {
                           //res.send(fcac)
                        })
                    })
                     .then(function (ff) {
                      
                       Servicio.crearContratoUsuario(usuariocom, contrato.id, "comprador")
                        .then(function (fce) {
                           //res.send(fce)
                         })
                     })
                    .then(function (ff) {
                      Usuario.findOne({
                        docid: req.param("uservend")
                      }).then((usuariovend) => {
                       //sails.log.debug(usuariovend)

                          Servicio.crearContratoUsuario(usuariovend, contrato.id, "vendedor")
                          .then(function (fce) {
                         // sails.log.debug(res.send(fce))
                            res.send(fce)
                          })
                  
                      })
                    })
                    .catch(function (err) {
                      return res.send(err);
                    })
                })
                .catch(err => {
                  return res.send({
                    success: false,
                    massage: "An Error in Register general",
                    'err': err
                  });
                })
              // })
              // .catch(err => {
              //   return res.send({
              //     success: false,
              //     massage: "usuario vendedor no Found  ",
              //     'err': err
              //   });
              // })
             })
             .catch(err => {
               return res.send({
                 success: true,
                 massage: "usuario comprador no Found  ",
                 'err': err
               });
             })
        }).catch(err => {
          return res.send({
            success: true,
            massage: "Usuariolog no Found ",
            'err': err
          });
        })
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
