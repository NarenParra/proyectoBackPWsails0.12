/**
 * ContratoController
 *
 * @description :: Server-side logic for managing Contratoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {

    Servicio.obtener(Contrato)
    .then(function (ff){
      res.send(ff)
    })
    .catch(function (err) { return res.serverError(err); });
        
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
//   create: function (req, res) {
//     sails.log.debug(req.allParams());

//     Estado.findOne({
//         titulo: req.param("estado")
//       })
//       .then((estado) => {
//         var parametros = req.allParams();
//         sails.log.debug(parametros);
//         if (typeof estado == 'object') {
//           //sails.log.debug(req.param("titulo"), estado.id);
//           parametros.estado = estado.id;
//           sails.log.debug(parametros);
//           Contrato.create(parametros)
//             .then(function (coontrato) {

//               return res.send({
//                 success: true,
//                 massage: "Creado Correctamente "
//               });
//             })
//             .catch(err => {
//               return res.send({
//                 success: false,
//                 massage: "An Error in Register",
//                 'err': err
//               });
//             })
//         } else {
//           return res.send({
//             success: true,
//             massage: "Estado no Founddd",
//             'err': err
//           });
//         }
//       })
//       .catch(err => {
//         return res.send({
//           success: true,
//           massage: "Estado no Found  ",
//           'err': err
//         });
//       })
//   }
// };

create: function (req, res) {
  sails.log.debug(req.allParams());

  Estado.findOne({
      titulo: req.param("estado")
    })
    .then((estado) => {
     // var parametros = req.allParams();
     // sails.log.debug(parametros);
      if (typeof estado == 'object') {
        //sails.log.debug(req.param("titulo"), estado.id);
       // parametros.estado = estado.id;
       // sails.log.debug(parametros);
        Contrato.create({estado:estado.id,observaciones:req.param('observaciones'),valor:req.param('valor'),fechainicia:req.param('fechainicia'),contratoCiudad:req.param('contratoCiudad')})
          .then(function (coontrato) {
            
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
        massage: "Estado no Found  ",
        'err': err
      });
    })
}
};