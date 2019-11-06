/**
 * MensajeController
 *
 * @description :: Server-side logic for managing mensajes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {
    Mensaje.find().sort({$natural:-1}).exec((err, mensaje) => {
      if (err) {
        res.serverError(err)
      }
      if (mensaje == 0) {
        res.send("no hay datos")
      }else{
        console.log(mensaje)
          res.send(mensaje)
      }
    })
  },

//   post: function (req, res) {
//     Mensaje.created({
//         titulo: req.titulo,
//         descripcion: req.descripcion,
//         hora: req.hora,
//         fecha: req.fecha,
//         contrato: req.contrato
//       })
//       .exec((err, mensaje) => {
//         if (err) {
//           res.serverError(err)
//         }else{
//             console.log(mensaje)
//         }
//       })
//   }

};
