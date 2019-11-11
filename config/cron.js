var moment = require('moment');
moment.locale('es');

var contador = 0;
var titulo = "";
var descripcion = "";
var fecha = "";
var hora = "";
var inicio = "";
var fechapago = "";
var mensaje = "";
module.exports.cron = {


  myFirstJob: {
    schedule: '6 8 * * * *',
    //schedule: '* * * * * *',
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
                    }).sort({
                      $natural: -1
                    }).exec((err, pago) => {
                      if (err) {
                        return res.serverError(err);
                      }
                      if (pago.length == 0) {
                        console.log("entra no pago")
                        console.log(contratoetiqueta.descripcion)

                        if (contratoetiqueta.descripcion == "En una fecha determinada posterior" || contratoetiqueta.descripcion == "De forma periodica") {
                          console.log("entra if")
                          var unidad = "";
                          if (contratoetiqueta.unidadPeriodo == 'Días') {
                            unidad = "days";
                          } else if (contratoetiqueta.unidadPeriodo == 'Meses' || contratoetiqueta.unidadPeriodo == 'Mensuales') {
                            unidad = "month"
                          } else if (contratoetiqueta.unidadPeriodo == 'Años' || contratoetiqueta.unidadPeriodo == 'Anuales') {
                            unidad = "year"
                          }


                          if (contratoetiqueta.descripcion == "De forma periodica") {
                            inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                            fechapago = moment(inicio).add(1, unidad).format("YYYY-MM-DD");
                            mensaje = " primer pago ";

                          } else if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {
                            inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                            fechapago = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                            mensaje = " pago";
                          }

                          var now = moment().format("YYYY-MM-DD");
                          var diasParaPago = moment(fechapago).diff(now, 'days');
                          console.log(diasParaPago)
                          if (diasParaPago > 0 && diasParaPago <= 3) {
                            titulo = "Faltan pocos días para realizar el pago"
                            descripcion = 'EL contrato se debe pagar pronto, faltan ' + diasParaPago + ' días para el ' + mensaje
                            hora = moment().format('HH:mm');
                            fecha = now
                            Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                              .then((mensaje) => {
                                console.log(mensaje)
                              })
                          } else if (moment(now).isSame(fechapago)) {
                            titulo = "Hoy, día de pago"
                            descripcion = "Flatan 0 dias para el" + mensaje
                            hora = moment().format('HH:mm');
                            fecha = now
                            Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                              .then((mensaje) => {
                                console.log(mensaje)
                              })

                          } else if (moment(now).isAfter(fechapago)) {
                            console.log("entra after")
                            console.log(diasParaPago)
                            if (diasParaPago * -1 > 0 && diasParaPago * -1 <= 60) {
                              //calcular intereses

                              titulo = "Se encuentra en mora"
                              descripcion = "El " + mensaje + " esta atrasado" + diasParaPago + '  días ';
                              hora = moment().format('HH:mm');
                              fecha = now
                              Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                .then((mensaje) => {
                                  console.log(mensaje)
                                })
                            } else if (diasParaPago * -1 > 60) {
                              titulo = "Mora mayor a dos meses"
                              descripcion = "El " + mensaje + "esta atrasado" + diasParaPago + '  días. ' + "El caso fue enviado a jurídica";
                              hora = moment().format('HH:mm');
                              fecha = now
                              Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                .then((mensaje) => {
                                  console.log(mensaje)
                                })
                              //enviar email a juridica

                            }
                          }
                        }

                      } else { //ya con pagos
                        if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {
                          console.log("entra else posterior")

                          if (element.finalidad == "Compraventa") {
                            Estado.findOne({
                              slug: "finalizado"
                            }).exec((err, stade) => {
                              if (err) {
                                console.log("err")
                              }
                              if (!stade) {
                                console.log("no estado")
                              } else {
                                if (pago.length == 1) {
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
                                      if (!contratoup) {

                                      } else {
                                        titulo = "Contrato pagado y finalizado"
                                        descripcion = 'EL pago del contrato a sido realizado satisfactoriamente ' + '\n' + 'con un valor de : ' + pago[0].monto + " El contrato de Compraventa se da por finalizado";
                                        hora = moment().format('HH:mm');
                                        fecha = moment().format('YYYY-MM-DD');
                                        Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                          .then((mensaje) => {
                                            console.log(mensaje)
                                          })
                                      }
                                    })
                                  } else if (pago[0].monto < element.valor) {

                                    titulo = "EL pago realizado para el contrato es menor a la deuda"
                                    descripcion = 'EL pago realizado es menor a la deuda ' + '\n' + 'Pago : ' + pago[0].monto + '\n' + 'Deuda : ' + element.valor
                                    hora = moment().format('HH:mm');
                                    fecha = moment().format('YYYY-MM-DD');
                                    Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                      .then((mensaje) => {
                                        console.log(mensaje)
                                      })

                                    Contrato.update(element.id, {
                                      pagado: pago[0].monto,
                                      cancelo: false,
                                    }).exec((err, contratoup) => {
                                      if (err) {
                                        return res.serverError(err);
                                      }
                                    })
                                  }
                                } else {
                                  var sumadepagos = 0;
                                  pago.forEach(element => {
                                    sumadepagos += element.monto;
                                  });

                                  if (sumadepagos == element.valor) {
                                    console.log("entra if")

                                    Contrato.update(element.id, {
                                      pagado: sumadepagos,
                                      cancelo: true,
                                      estado: stade.id
                                    }).exec((err, contratoup) => {
                                      if (err) {
                                        return res.serverError(err);
                                      }
                                      if (!contratoup) {

                                      } else {
                                        titulo = "Contrato pagado y finalizado"
                                        descripcion = 'EL pago del contrato a sido realizado satisfactoriamente ' + '\n' + 'con un valor de : ' + sumadepagos + " El contrato de Compraventa se da por finalizado";
                                        hora = moment().format('HH:mm');
                                        fecha = moment().format('YYYY-MM-DD');
                                        Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                          .then((mensaje) => {
                                            console.log(mensaje)
                                          })
                                      }
                                    })
                                  } else if (sumadepagos < element.valor) {

                                    titulo = "EL pago realizado para el contrato es menor a la deuda"
                                    descripcion = 'EL pago realizado es menor a la deuda ' + '\n' + 'Pago : ' + sumadepagos + '\n' + 'Deuda : ' + element.valor
                                    hora = moment().format('HH:mm');
                                    fecha = moment().format('YYYY-MM-DD');
                                    Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                      .then((mensaje) => {
                                        console.log(mensaje)
                                      })

                                    Contrato.update(element.id, {
                                      pagado: sumadepagos,
                                      cancelo: false,
                                    }).exec((err, contratoup) => {
                                      if (err) {
                                        return res.serverError(err);
                                      }
                                    })
                                  }

                                }

                              }
                            })
                          }

                        } else if (contratoetiqueta.descripcion == "De forma periodica") {

                          if (contratoetiqueta.unidadPeriodo == 'Días') {
                            unidad = "days";
                          } else if (contratoetiqueta.unidadPeriodo == 'Meses' || contratoetiqueta.unidadPeriodo == 'Mensuales') {
                            unidad = "month"
                          } else if (contratoetiqueta.unidadPeriodo == 'Años' || contratoetiqueta.unidadPeriodo == 'Anuales') {
                            unidad = "year"
                          }

                          inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                          var fechafin = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                          var ultimopago = moment(inicio).add(pago[0].cuota, unidad).format("YYYY-MM-DD");
                          var proximopago = moment(ultimopago).add(1, unidad).format("YYYY-MM-DD");
                          var fechafin = moment(element.fechainicia).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                          var finmenosuno = moment(fechafin).subtract(1, unidad).format("YYYY-MM-DD")
                          var now = moment().format("YYYY-MM-DD");
                          var diasParaPago = moment(proximopago).diff(now, 'days');
                          console.log(diasParaPago)
                          // restar dias
                          //moment().subtract(7, 'days');
                          //entre 
                          //moment('2018-08-11').isBetween('2018-08-30', '2018-08-01');

                          if (moment.ultimopago) {

                          }

                          var sumadepagos = 0;
                          pago.forEach(pay => {
                            sumadepagos += pay.monto
                          });

                          var valorcuota = (element.valor - element.pagado) / parseInt(contratoetiqueta.cantidadPeriodo);
                          console.log("valorcuota")
                          console.log(valorcuota)
                          console.log("diasParaPago")
                          console.log(diasParaPago)
                          console.log("proximopago")
                          console.log(proximopago)
                          console.log("ultimopago")
                          console.log(ultimopago)


                          // si el ultimo pago es mayor a 30  o 360 dias de la fecha actul


                          if (moment(ultimopago).isBetween(finmenosuno, fechafin) && sumadepagos + element.pagado == element.valor) {
                            console.log("ya pago este men")
                            console.log("entra between")
                          } else if (moment(ultimopago).isBetween(finmenosuno, fechafin) && sumadepagos + element.pagado < element.valor) {
                            console.log("no ha pagado todo")
                          } else if (moment(proximopago).isSame(now)) {
                            console.log("hoy dia de pago")
                            titulo = "Hoy, día de pago"
                            descripcion = "Flatan 0 dias para el pago de la cuota"
                            hora = moment().format('HH:mm');
                            fecha = now
                            Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                              .then((mensaje) => {
                                console.log(mensaje)
                              })
                          } else if (moment(now).isAfter(proximopago)) {

                            if (diasParaPago * -1 > 0 && diasParaPago * -1 <= 60) {
                              //calcular intereses

                              titulo = "Se encuentra en mora"
                              descripcion = "El pago de la cuota esta atrasado" + diasParaPago + '  días ';
                              hora = moment().format('HH:mm');
                              fecha = now
                              Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                .then((mensaje) => {
                                  console.log(mensaje)
                                })
                            } else if (diasParaPago * -1 > 60) {
                              titulo = "Mora mayor a dos meses"
                              descripcion = "El pago de la cuota" + "esta atrasado" + diasParaPago + '  días. ' + "El caso fue enviado a jurídica";
                              hora = moment().format('HH:mm');
                              fecha = now
                              Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                .then((mensaje) => {
                                  console.log(mensaje)
                                })
                              //enviar email a juridica

                            }
                          } else if (diasParaPago > 0 && diasParaPago <= 3) {
                            titulo = "Faltan pocos días para realizar el siguiente pago"
                            descripcion = 'EL contrato se debe pagar pronto, faltan ' + diasParaPago + ' días para el pago de la cuota'
                            hora = moment().format('HH:mm');
                            fecha = now
                            Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                              .then((mensaje) => {
                                console.log(mensaje)
                              })
                          }

                        }
                      }
                    })
                  }
                })
              }
            });
          }
        })
    }
  }
};
