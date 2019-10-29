var moment = require('moment');
moment.locale('es');
var contador = 0;
module.exports.cron = {

  myFirstJob: {
    schedule: '* * * * * *',
    onTick: function () {


      Contrato.find()
        .populate('estado')
        .exec((err, contrato) => {
          if (err) {
            return res.serverError(err);
          }
          if (contrato.lenth == 0) {
            return res.serverError("No hay datos");
          } else {

            // console.log("contrato")
            // console.log(contrato)


            contrato.forEach(element => {
              if (element.estado.slug == 'iniciado') {
                ContratoEtiqueta.findOne({
                  contrato: element.id,
                  titulo: 'Precio'
                }).exec((err, contratoetiqueta) => {
                  if (err) {
                    return res.serverError(err);
                  }
                  if (contratoetiqueta.length == 0) {
                    return res.serverError("no hay datos");
                  } else {
                    Pago.find({
                      contrato: element.id
                    }).exec((err, pago) => {
                      if (err) {
                        return res.serverError(err);
                      }
                      if (pago.length == 0) {
                        if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {
                          console.log('entra fecha otra')
                          // va la logica de que hay que hacer con fecha posterior
                          var unidad = "";
                          if (contratoetiqueta.unidadPeriodo == 'Días') {
                            unidad = "days";
                          } else if (contratoetiqueta.unidadPeriodo == 'Meses') {
                            unidad = "month"
                          } else if (contratoetiqueta.unidadPeriodo == 'Años') {
                            unidad = "year"
                          }

                          var inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                          console.log("inicio")
                          console.log(inicio)
                          var inicioCantidad = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                          console.log("inicio mas cantidad aplazada")
                          console.log(inicioCantidad)
                          var now = moment().format("YYYY-MM-DD");
                          var diasParaPago = moment(inicioCantidad).diff(now, 'days');
                          console.log("dias")
                          console.log(diasParaPago)

                          console.log(contador++)

                          if (diasParaPago > 0 && diasParaPago <= 3) {
                            console.log('debe pagar pronto, faltan ' + diasParaPago + ' dias para el pago')
                            // estructura Email

                          } else if (moment(now).isSame(inicioCantidad)) {
                            console.log('Hoy es el dia del pago, faltan ' + diasParaPago + ' dias para el pago')
                          } else if (moment(now).isAfter(inicioCantidad)) {
                            console.log('Pago atrazado, ' + diasParaPago + ' dias ')
                            // calcular intereses
                          }

                        } // else if (contratoetiqueta.descripcion == "De forma periodica") {
                        //   console.log("Peroidico")
                        //   console.log(element)
                        //   var now = moment().format("YYYY-MM-DD");
                        //   var inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                        //   console.log(now)
                        //   diferencia = moment(now).diff(inicio, 'days');
                        //   console.log("diferencia")
                        //   console.log(diferencia)
                        // }
                      } else {
                        if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {
                          console.log("entra else posterior")

                          Estado.findOne({
                            slug: "finalizado"
                          }).exec((err, stade) => {
                            if (err) {
                              console.log("err")
                            }
                            if (stade == 0) {
                              console.log("no estado")
                            } else {
                              if (pago[0].monto == element.valor) {
                                console.log("entra if")
                                Contrato.update(element.id, {
                                  pagado: pago[0].monto,
                                  cancelo: true,
                                  estado: stade.id
                                }).exec((err, contratoup) => {
                                  if (err) {
                                    return res.serverError(err);
                                  }
                                })
                              }

                            }
                          })
                        }
                      }
                    })
                  }
                })
              }


            });
          }
        })



      // Contrato.find()
      //   .populate('estado')
      //   .exec((err, contrato) => {
      //     if (err) {
      //       return res.serverError(err);
      //     }
      //     if (contrato.lenth == 0) {
      //       return res.serverError("No hay datos");
      //     } else {
      //       contrato.forEach(element => {
      //         if (element.estado.slug == 'iniciado') {
      //           //elemt.finalidad
      //           if (element.cancelo == true && element.finalidad == "Compraventa") {
      //             console.log('ya esta pagado')
      //             ///camba estado a finalizado
      //             Estado.findOne({
      //               slug: 'finalizado'
      //             }).exec((err, estado) => {
      //               if (err) {
      //                 return res.serverError(err);
      //               }
      //               if (estado == 0) {
      //                 return res.serverError("No hay Estados");
      //               } else {
      //                 Contrato.update(element.id, {
      //                   estado: estado.id
      //                 }).exec((err, contratoup) => {
      //                   if (err) {
      //                     return res.serverError(err);
      //                   }
      //                 })
      //               }

      //             })
      //           } else {
      //             ContratoEtiqueta.findOne({
      //               contrato: element.id,
      //               titulo: 'Precio'
      //             }).exec((err, contratoetiqueta) => {
      //               if (err) {
      //                 return res.serverError(err);
      //               }
      //               if (contratoetiqueta.length == 0) {
      //                 return res.serverError("no hay datos");
      //               } else {
      //                 if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {
      //                   console.log('entra fecha otra')
      //                   // va la logica de que hay que hacer con fecha posterior
      //                   var unidad = "";
      //                   if (contratoetiqueta.unidadPeriodo == 'Días') {
      //                     unidad = "days";
      //                   } else if (contratoetiqueta.unidadPeriodo == 'Meses') {
      //                     unidad = "month"
      //                   } else if (contratoetiqueta.unidadPeriodo == 'Años') {
      //                     unidad = "year"
      //                   }

      //                   var inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
      //                   console.log("inicio")
      //                   console.log(inicio)
      //                   var inicioCantidad = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
      //                   console.log("inicio mas cantidad aplazada")
      //                   console.log(inicioCantidad)
      //                   var now = moment().format("YYYY-MM-DD");
      //                   var diasParaPago = moment(inicioCantidad).diff(now, 'days');
      //                   console.log("dias")
      //                   console.log(diasParaPago)

      //                   console.log(contador++)

      //                   if (diasParaPago > 0 && diasParaPago <= 3) {
      //                     console.log('debe pagar pronto, faltan ' + diasParaPago + ' dias para el pago')
      //                     // cumo sacar los usuarios?

      //                     // estructura Email
      //                     // let mailOptions = {
      //                     //   from: "vendedor@gmail.com",
      //                     //   to: "comprador@gmail.com",
      //                     //   subject: `Not a GDPR update ;)`,
      //                     //   text: `Hi there, this email was automatically sent by us`
      //                     // };
      //                   } else if (moment(now).isSame(inicioCantidad)) {
      //                     console.log('Hoy es el dia del pago, faltan ' + diasParaPago + ' dias para el pago')
      //                   } else if (moment(moment(now)).isAfter(inicioCantidad)) {
      //                     console.log('Pago atrazado, ' + diasParaPago + ' dias ')
      //                     // calcular intereses
      //                   }

      //                 } else if (contratoetiqueta.descripcion == "De forma periodica") {
      //                   console.log('PERIODICA')
      //                   var unidad = "";
      //                   if (contratoetiqueta.unidadPeriodo == 'Mensuales') {
      //                     unidad = "month"
      //                   } else if (contratoetiqueta.unidadPeriodo == 'Anuales') {
      //                     unidad = "year"
      //                   }

      //                   console.log("unidad")
      //                   console.log(unidad)
      //                   var inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
      //                   console.log("inicio")
      //                   console.log(inicio)
      //                   var diferencia = "";

      //                   Pago.find({
      //                     contrato: element.id
      //                   }).sort({
      //                     $natural: -1
      //                   }).exec((err, pago) => {
      //                     if (err) {
      //                       return res.serverError(err);
      //                     }
      //                     if (pago == 0) {
      //                       var now = moment().format("YYYY-MM-DD");
      //                       diferencia = moment(now).diff(inicio, 'days');
      //                       console.log("diferencia")
      //                       console.log(diferencia)
      //                     } else {
      //                       console.log("ELSE")
      //                       console.log(pago.length)
      //                       var now = moment().format("YYYY-MM-DD");
      //                       var ultimoPago = moment(inicio).add(pago.length, unidad).format("YYYY-MM-DD");
      //                       //console.log(pago)
      //                       diferencia = moment(now).diff(pago[0].fecha, 'days');

      //                       console.log("diferencia")
      //                       console.log(diferencia)

      //                       if (diferencia > 0 && diferencia <= 3) {
      //                         console.log("debe pagar pronto")
      //                       } else if (diferencia == 0) {
      //                         console.log("hoy es el dia del pago")
      //                       } else if (diferencia < 0) {
      //                         console.log("pago atrazado")
      //                       }
      //                     }
      //                   })

      //                 }
      //               }
      //             })
      //           }

      //         } else {
      //           // console.log(element)
      //         }

      //       });
      //     }
      //   })
    }
  }
};
