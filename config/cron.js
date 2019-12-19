var moment = require("moment");
moment.locale("es");

var titulo = "";
var descripcion = "";
var fecha = "";
var hora = "";
var inicio = "";
var fechapago = "";
var mensaje = "";

let nodemailer = require("nodemailer");

//email
let transporter = nodemailer.createTransport("smtp://smtp.ethereal.email", {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "sam.harvey4@ethereal.email",
    pass: "PrfnNKz3Ag3BgaSNTS"
  }
});

module.exports.cron = {
  myFirstJob: {
    schedule: "6  14 * * *",
    //schedule: '6 */55 * * * *',
    onTick: function() {
      Contrato.find(
       {cancelo:false}
      )
        .populate("estado")
        .exec((err, contrato) => {
          if (err) {
            return res.serverError(err);
          }
          if (contrato.lenth == 0) {
            return res.serverError("No hay datos");
          } else {
            contrato.forEach(element => {
              if (element.estado.slug == "iniciado") {
                ContratoEtiqueta.findOne({
                  contrato: element.id,
                  titulo: "Precio"
                }).exec((err, contratoetiqueta) => {
                  if (err) {
                    return res.serverError(err);
                  }
                  if (contratoetiqueta.length == 0) {
                    return res.serverError("no hay datos");
                  } else {
                    Pago.find({
                      contrato: element.id
                    })
                      .sort({
                        $natural: -1
                      })
                      .exec((err, pago) => {
                        if (err) {
                          return res.serverError(err);
                        }
                        //si no hay pagos
                        if (pago.length == 0) {
                          console.log("entra no pago");

                          if (
                            contratoetiqueta.descripcion ==
                              "En una fecha determinada posterior" ||
                            contratoetiqueta.descripcion == "De forma periodica"
                          ) {
                            console.log("entra if no pago 1");
                            var unidad = "";
                            /*var unidad = {
                              'Días': 'days'
                            };*/
                            if (contratoetiqueta.unidadPeriodo == "Días") {
                              unidad = "days";
                            } else if (
                              contratoetiqueta.unidadPeriodo == "Meses" ||
                              contratoetiqueta.unidadPeriodo == "Mensuales"
                            ) {
                              unidad = "month";
                            } else if (
                              contratoetiqueta.unidadPeriodo == "Años" ||
                              contratoetiqueta.unidadPeriodo == "Anuales"
                            ) {
                              unidad = "year";
                            }

                            if (
                              contratoetiqueta.descripcion ==
                              "De forma periodica"
                            ) {
                              inicio = moment(element.fechainicia)
                                .add(1, "days")
                                .format("YYYY-MM-DD");
                              fechapago = moment(inicio)
                                .add(1, unidad)
                                .format("YYYY-MM-DD");
                              mensaje = " primer pago ";
                            } else if (
                              contratoetiqueta.descripcion ==
                              "En una fecha determinada posterior"
                            ) {
                              inicio = moment(element.fechainicia)
                                .add(1, "days")
                                .format("YYYY-MM-DD");
                              fechapago = moment(inicio)
                                .add(contratoetiqueta.cantidadPeriodo, unidad)
                                .format("YYYY-MM-DD");
                              mensaje = " pago";
                            }

                            var now = moment().format("YYYY-MM-DD");
                            var diasParaPago = moment(fechapago).diff(
                              now,
                              "days"
                            );
                            var interes = 0;
                            var nuevoValorPago = 0;
                            var valorAnterior = 0;
                            console.log(diasParaPago);
                            if (diasParaPago > 0 && diasParaPago <= 3) {
                              let message = {
                                titulo:
                                  "Faltan pocos días para realizar el pago",
                                descripcion:
                                  "EL contrato se debe pagar pronto, faltan " +
                                  diasParaPago +
                                  " días para el " +
                                  mensaje,
                                hora: moment().format("HH:mm"),
                                fecha: now,
                                contrato: element.id
                              };

                              sails.request(
                                "POST http://localhost:1337/api/mensaje",
                                message,
                                function(err, response, body) {
                                  if (err) {
                                    sails.log.debug(err);
                                  }
                                  if (!body.success) {
                                    sails.log.debug("error en el registro");
                                  }
                                }
                              );
                            } else if (moment(now).isSame(fechapago)) {
                              let message = {
                                titulo: "Hoy, día de pago",
                                descripcion: "Flatan 0 dias para el" + mensaje,
                                hora: moment().format("HH:mm"),
                                fecha: now,
                                contrato: element.id
                              };

                              sails.request(
                                "POST http://localhost:1337/api/mensaje",
                                message,
                                function(err, response, body) {
                                  if (err) {
                                    sails.log.debug(err);
                                  }
                                  if (!body.success) {
                                    sails.log.debug("error en el registro");
                                  }
                                }
                              );
                            } else if (moment(now).isAfter(fechapago)) {
                              console.log("entra after");
                              console.log(diasParaPago);
                              if (
                                diasParaPago * -1 > 0 &&
                                diasParaPago * -1 <= 60
                              ) {
                                //Los intereses establecidos son de 3% mensual

                                if (
                                  contratoetiqueta.descripcion ==
                                  "En una fecha determinada posterior"
                                ) {
                                  // se calcula sobre el monto total
                                  valorAnterior = element.valor;
                                  interes =
                                    ((element.valor * 0.3) / 30) *
                                    (diasParaPago * -1);

                                  nuevoValorPago = valorAnterior + interes;
                                  console.log("fecha determinada");
                                } else if (
                                  contratoetiqueta.descripcion ==
                                  "De forma periodica"
                                ) {
                                  // se calcula sobre el valor de la cuota
                                  valorAnterior =
                                    (element.valor - element.pagado) /
                                    contratoetiqueta.cantidadPeriodo;
                                  interes =
                                    ((valorAnterior * 0.3) / 30) *
                                    (diasParaPago * -1);

                                  nuevoValorPago = valorAnterior + interes;
                                  console.log("periodica");
                                }

                                let message = {
                                  titulo: "Se encuentra en mora",
                                  descripcion:
                                    "El " +
                                    mensaje +
                                    " está atrasado" +
                                    diasParaPago +
                                    "  días" +
                                    "<br>" +
                                    " El valor a pagar era de " +
                                    valorAnterior +
                                    "<br>" +
                                    " El nuevo valor a pagar con intereses es de " +
                                    nuevoValorPago +
                                    " PESOS",
                                  hora: moment().format("HH:mm"),
                                  fecha: now,
                                  contrato: element.id
                                };

                                sails.request(
                                  "POST http://localhost:1337/api/mensaje",
                                  message,
                                  function(err, response, body) {
                                    if (err) {
                                      sails.log.debug(err);
                                    }
                                    if (!body.success) {
                                      sails.log.debug("error en el registro");
                                    } else {
                                      Servicio.actualizarContratoEtiqueta(
                                        element.id,
                                        nuevoValorPago
                                      ).then(retorno => {
                                        console.log(retorno);
                                      });
                                    }
                                  }
                                );
                              } else if (diasParaPago * -1 > 60) {
                                let message = {
                                  titulo: "Mora mayor a dos meses",
                                  descripcion:
                                    "El " +
                                    mensaje +
                                    "está atrasado" +
                                    diasParaPago +
                                    "  días. " +
                                    "<br>" +
                                    "El caso fue enviado a jurídica",
                                  hora: moment().format("HH:mm"),
                                  fecha: now,
                                  contrato: element.id
                                };

                                sails.request(
                                  "POST http://localhost:1337/api/mensaje",
                                  message,
                                  function(err, response, body) {
                                    if (err) {
                                      sails.log.debug(err);
                                    }
                                    if (!body.success) {
                                      sails.log.debug("error en el registro");
                                    } else {
                                      //email
                                      let mailOptions = {
                                        from: "nombreEmpresa@gmail.com",
                                        to: "juridicaEmpresa@gmail.com",
                                        subject: `Mora mayor a dos meses`,
                                        text:
                                          "El contrato " +
                                          element.observaciones +
                                          "ha sobrepasado el limite de mora"
                                      };
                                      transporter.sendMail(
                                        mailOptions,
                                        function(error, info) {
                                          if (error) {
                                            console.log(error);
                                            throw error;
                                          } else {
                                            console.log(
                                              "Email successfully sent!"
                                            );
                                            console.log(info);
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          }
                        } else {
                          //ya con pagos
                          if (
                            contratoetiqueta.descripcion ==
                            "En una fecha determinada posterior"
                          ) {
                            console.log("entra else posterior fecha det ");

                            if (element.finalidad == "Compraventa") {
                              Estado.findOne({
                                slug: "finalizado"
                              }).exec((err, stade) => {
                                if (err) {
                                  console.log("err");
                                }
                                if (!stade) {
                                  console.log("no estado");
                                } else {
                                  if (pago.length == 1) {
                                    if (
                                      pago[0].monto >= contratoetiqueta.valor
                                    ) {
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
                                          let message = {
                                            titulo:
                                              "Contrato pagado y finalizado",
                                            descripcion:
                                              "EL pago del contrato ha sido realizado satisfactoriamente " +
                                              "con un valor de : " +
                                              pago[0].monto +
                                              "<br>" +
                                              "El contrato de Compraventa se da por finalizado",
                                            hora: moment().format("HH:mm"),
                                            fecha: moment().format(
                                              "YYYY-MM-DD"
                                            ),
                                            contrato: element.id
                                          };
                                          sails.request(
                                            "POST http://localhost:1337/api/mensaje",
                                            message,
                                            function(err, response, body) {
                                              if (err) {
                                                sails.log.debug(err);
                                              }
                                              if (!body.success) {
                                                sails.log.debug(
                                                  "error en el registro"
                                                );
                                              }
                                            }
                                          );
                                        }
                                      });
                                    } else if (
                                      pago[0].monto < contratoetiqueta.valor
                                    ) {
                                      let message = {
                                        titulo:
                                          "EL pago realizado para el contrato es menor a la deuda",
                                        descripcion:
                                          "EL pago realizado es menor a la deuda " +
                                          "<br>" +
                                          "Pago : " +
                                          pago[0].monto +
                                          "<br>" +
                                          "Deuda : " +
                                          contratoetiqueta.valor,
                                        hora: moment().format("HH:mm"),
                                        fecha: moment().format("YYYY-MM-DD"),
                                        contrato: element.id
                                      };

                                      sails.request(
                                        "POST http://localhost:1337/api/mensaje",
                                        message,
                                        function(err, response, body) {
                                          if (err) {
                                            sails.log.debug(err);
                                          }
                                          if (!body.success) {
                                            sails.log.debug(
                                              "error en el registro"
                                            );
                                          } else {
                                            Contrato.update(element.id, {
                                              pagado: pago[0].monto,
                                              cancelo: false
                                            }).exec((err, contratoup) => {
                                              if (err) {
                                                return res.serverError(err);
                                              }
                                            });
                                          }
                                        }
                                      );
                                    }
                                  } else {
                                    // si la suma de los pagos es igual a la deuda
                                    console.log("entra else mas pagos");
                                    var sumadepagos = 0;
                                    pago.forEach(element => {
                                      sumadepagos += element.monto;
                                    });

                                    if (sumadepagos >= contratoetiqueta.valor) {
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
                                          let message = {
                                            titulo:
                                              "Contrato pagado y finalizado",
                                            descripcion:
                                              "EL pago del contrato ha sido realizado satisfactoriamente " +
                                              "con un valor total de : " +
                                              sumadepagos +
                                              "<br>" +
                                              " El contrato de Compraventa se da por finalizado",
                                            hora: moment().format("HH:mm"),
                                            fecha: moment().format(
                                              "YYYY-MM-DD"
                                            ),
                                            contrato: element.id
                                          };

                                          sails.request(
                                            "POST http://localhost:1337/api/mensaje",
                                            message,
                                            function(err, response, body) {
                                              if (err) {
                                                sails.log.debug(err);
                                              }
                                              if (!body.success) {
                                                sails.log.debug(
                                                  "error en el registro"
                                                );
                                              }
                                            }
                                          );
                                        }
                                      });
                                    } else if (
                                      // si la suma de pagos es menor a la deuda
                                      sumadepagos < contratoetiqueta.valor
                                    ) {
                                      message = {
                                        titulo:
                                          "EL pago realizado para el contrato es menor a la deuda",
                                        descripcion:
                                          "EL pago realizado es menor a la deuda " +
                                          "<br>" +
                                          "Pago : " +
                                          sumadepagos +
                                          "<br>" +
                                          "Deuda : " +
                                          contratoetiqueta.valor,
                                        hora: moment().format("HH:mm"),
                                        fecha: moment().format("YYYY-MM-DD"),
                                        contrato: element.id
                                      };
                                      sails.request(
                                        "POST http://localhost:1337/api/mensaje",
                                        message,
                                        function(err, response, body) {
                                          if (err) {
                                            sails.log.debug(err);
                                          }
                                          if (!body.success) {
                                            sails.log.debug(
                                              "error en el registro"
                                            );
                                          }
                                        }
                                      );

                                      Contrato.update(element.id, {
                                        pagado: sumadepagos,
                                        cancelo: false
                                      }).exec((err, contratoup) => {
                                        if (err) {
                                          return res.serverError(err);
                                        }
                                      });
                                    }
                                  }
                                }
                              });
                            }
                          } else if (
                            // para pagos de forma periodica
                            contratoetiqueta.descripcion == "De forma periodica"
                          ) {
                            if (contratoetiqueta.unidadPeriodo == "Días") {
                              unidad = "days";
                            } else if (
                              contratoetiqueta.unidadPeriodo == "Meses" ||
                              contratoetiqueta.unidadPeriodo == "Mensuales"
                            ) {
                              unidad = "month";
                            } else if (
                              contratoetiqueta.unidadPeriodo == "Años" ||
                              contratoetiqueta.unidadPeriodo == "Anuales"
                            ) {
                              unidad = "year";
                            }

                            inicio = moment(element.fechainicia)
                              .add(1, "days")
                              .format("YYYY-MM-DD");
                            var fechafin = moment(inicio)
                              .add(contratoetiqueta.cantidadPeriodo, unidad)
                              .format("YYYY-MM-DD");
                            var ultimopago = moment(inicio)
                              .add(pago[0].cuota, unidad)
                              .format("YYYY-MM-DD");
                            var proximopago = moment(ultimopago)
                              .add(1, unidad)
                              .format("YYYY-MM-DD");
                            var fechafin = moment(element.fechainicia)
                              .add(contratoetiqueta.cantidadPeriodo, unidad)
                              .format("YYYY-MM-DD");
                            var finmenosuno = moment(fechafin)
                              .subtract(1, unidad)
                              .format("YYYY-MM-DD");
                            var now = moment().format("YYYY-MM-DD");
                            var diasParaPago = moment(proximopago).diff(
                              now,
                              "days"
                            );

                            var sumadepagos = 0;
                            pago.forEach(pay => {
                              sumadepagos += pay.monto;
                            });

                            var valorcuota =
                              (element.valor - element.pagado) /
                              parseInt(contratoetiqueta.cantidadPeriodo);

                            if (
                              moment(ultimopago).isBetween(
                                finmenosuno,
                                fechafin
                              ) &&
                              sumadepagos + element.pagado >= element.valor
                            ) {
                              Estado.findOne({
                                slug: "finalizado"
                              }).exec((err, stade) => {
                                if (err) {
                                  console.log("err");
                                }
                                if (!stade) {
                                  console.log("no estado");
                                } else {
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
                                      message = {
                                        titulo: "Contrato pagado y finalizado",
                                        descripcion:
                                          "EL pago del contrato ha sido realizado satisfactoriamente " +
                                          "\n" +
                                          "con un valor de : " +
                                          pago[0].monto +
                                          " El contrato de Compraventa se da por finalizado",
                                        hora: moment().format("HH:mm"),
                                        fecha: moment().format("YYYY-MM-DD"),
                                        contrato: element.id
                                      };
                                      sails.request(
                                        "POST http://localhost:1337/api/mensaje",
                                        message,
                                        function(err, response, body) {
                                          if (err) {
                                            sails.log.debug(err);
                                          }
                                          if (!body.success) {
                                            sails.log.debug(
                                              "error en el registro"
                                            );
                                          }
                                        }
                                      );
                                    }
                                  });
                                }
                              });
                              // si el ultimo pago se encuentra entre el penultima y ultima fecha de pago
                            } else if (
                              moment(ultimopago).isBetween(
                                finmenosuno,
                                fechafin
                              ) &&
                              sumadepagos + element.pagado < element.valor
                            ) {
                              console.log("no ha pagado todo");
                              diasParaPago = moment(fechafin).diff(now, "days");

                              if (
                                diasParaPago * -1 > 0 &&
                                diasParaPago * -1 <= 60
                              ) {
                                //// se calcula sobre el valor de la cuota
                                valorAnterior =
                                  (element.valor - element.pagado) /
                                  contratoetiqueta.cantidadPeriodo;
                                interes =
                                  ((valorAnterior * 0.3) / 30) *
                                  (diasParaPago * -1);

                                nuevoValorPago = valorAnterior + interes;
                                let message = {
                                  titulo: "Se encuentra en mora el ultimo pago",
                                  descripcion:
                                    "El pago" +
                                    " está atrasado" +
                                    diasParaPago +
                                    "  días" +
                                    " El valor a pagar era de " +
                                    valorAnterior +
                                    ". El nuevo valor a pagar con intereses es de " +
                                    nuevoValorPago +
                                    "PESOS",
                                  hora: moment().format("HH:mm"),
                                  fecha: now
                                };
                                sails.request(
                                  "POST http://localhost:1337/api/mensaje",
                                  message,
                                  function(err, response, body) {
                                    if (err) {
                                      sails.log.debug(err);
                                    }
                                    if (!body.success) {
                                      sails.log.debug("error en el registro");
                                    } else {
                                      Servicio.actualizarContratoEtiqueta(
                                        element.id,
                                        nuevoValorPago
                                      ).then(retorno => {
                                        console.log(retorno);
                                      });
                                    }
                                  }
                                );
                                //mora mayor a 60 dias
                              } else if (diasParaPago * -1 > 60) {
                                let message = {
                                  titulo: "Mora mayor a dos meses",
                                  descripcion:
                                    "El pago de la cuota" +
                                    "esta atrasado" +
                                    diasParaPago +
                                    "  días. " +
                                    "El caso fue enviado a jurídica",
                                  hora: moment().format("HH:mm"),
                                  fecha: now,
                                  contrato: element.id
                                };
                                sails.request(
                                  "POST http://localhost:1337/api/mensaje",
                                  message,
                                  function(err, response, body) {
                                    if (err) {
                                      sails.log.debug(err);
                                    }
                                    if (!body.success) {
                                      sails.log.debug("error en el registro");
                                    } else {
                                      //enviar correo
                                      let mailOptions = {
                                        from: "nombreEmpresa@gmail.com",
                                        to: "juridicaEmpresa@gmail.com",
                                        subject: `Mora mayor a dos meses`,
                                        text:
                                          "El contrato " +
                                          element.observaciones +
                                          "ha sobrepasado el limite de mora"
                                      };
                                      transporter.sendMail(
                                        mailOptions,
                                        function(error, info) {
                                          if (error) {
                                            console.log(error);
                                            throw error;
                                          } else {
                                            console.log(
                                              "Email successfully sent!"
                                            );
                                            console.log(info);
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                              //pago a realizar igual a la fecha actual
                            } else if (moment(proximopago).isSame(now)) {
                              console.log("hoy dia de pago");
                              let message = {
                                titulo: "Hoy, día de pago",
                                descripcion:
                                  "Flatan 0 dias para el pago de la cuota",
                                hora: moment().format("HH:mm"),
                                fecha: now,
                                contrato: element.id
                              };
                              sails.request(
                                "POST http://localhost:1337/api/mensaje",
                                message,
                                function(err, response, body) {
                                  if (err) {
                                    sails.log.debug(err);
                                  }
                                  if (!body.success) {
                                    sails.log.debug("error en el registro");
                                  }
                                }
                              );
                              //entra en mora
                            } else if (moment(now).isAfter(proximopago)) {
                              if (
                                diasParaPago * -1 > 0 &&
                                diasParaPago * -1 <= 60
                              ) {
                                //// se calcula sobre el valor de la cuota
                                valorAnterior =
                                  (element.valor - element.pagado) /
                                  contratoetiqueta.cantidadPeriodo;
                                interes =
                                  ((valorAnterior * 0.3) / 30) *
                                  (diasParaPago * -1);

                                nuevoValorPago = valorAnterior + interes;
                                let message = {
                                  titulo: "Se encuentra en mora",
                                  descripcion:
                                    "El pago" +
                                    " está atrasado" +
                                    diasParaPago +
                                    "  días" +
                                    " El valor a pagar era de " +
                                    valorAnterior +
                                    ". El nuevo valor a pagar con intereses es de " +
                                    nuevoValorPago +
                                    " PESOS",
                                  hora: moment().format("HH:mm"),
                                  fecha: now,
                                  contrato: element.id
                                };
                                sails.request(
                                  "POST http://localhost:1337/api/mensaje",
                                  message,
                                  function(err, response, body) {
                                    if (err) {
                                      sails.log.debug(err);
                                    }
                                    if (!body.success) {
                                      sails.log.debug("error en el registro");
                                    } else {
                                      Servicio.actualizarContratoEtiqueta(
                                        element.id,
                                        nuevoValorPago
                                      ).then(retorno => {
                                        console.log(retorno);
                                      });
                                    }
                                  }
                                );
                              }
                              // pago proximo a la fecha
                            } else if (diasParaPago > 0 && diasParaPago <= 3) {
                              let message = {
                                titulo:
                                  "Faltan pocos días para realizar el siguiente pago",
                                descripcion:
                                  "EL contrato se debe pagar pronto, faltan " +
                                  diasParaPago +
                                  " días para el pago de la cuota",
                                hora: moment().format("HH:mm"),
                                fecha: now,
                                contrato: element.id
                              };
                              sails.request(
                                "POST http://localhost:1337/api/mensaje",
                                message,
                                function(err, response, body) {
                                  if (err) {
                                    sails.log.debug(err);
                                  }
                                  if (!body.success) {
                                    sails.log.debug("error en el registro");
                                  }
                                }
                              );
                              //pagado despues de la fecha limite
                            } else if (
                              sumadepagos >= element.valor &&
                              moment(fechafin).isAfter(ultimopago)
                            ) {
                              console.log("pagado");

                              Estado.findOne({
                                slug: "finalizado"
                              }).exec((err, stade) => {
                                if (err) {
                                  console.log("err");
                                }
                                if (!stade) {
                                  console.log("no estado");
                                } else {
                                  let message = {
                                    titulo: "Contrato pagado y finalizado",
                                    descripcion:
                                      "EL pago del contrato ha sido realizado satisfactoriamente " +
                                      "con un valor de : " +
                                      sumadepagos +
                                      "<br>" +
                                      "El contrato de Compraventa se da por finalizado",
                                    hora: moment().format("HH:mm"),
                                    fecha: moment().format("YYYY-MM-DD"),
                                    contrato: element.id
                                  };
                                  sails.request(
                                    "POST http://localhost:1337/api/mensaje",
                                    message,
                                    function(err, response, body) {
                                      if (err) {
                                        sails.log.debug(err);
                                      }
                                      if (!body.success) {
                                        sails.log.debug("error en el registro");
                                      } else {
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
                                            console.log(contratoup);
                                          }
                                        });
                                      }
                                    }
                                  );
                                }
                              });
                              //ultimo pago menor a la deuda
                            } else if (pago[0].monto < contratoetiqueta.valor) {
                              let message = {
                                titulo: "EL pago menor a la cuota",
                                descripcion:
                                  "EL pago realizado es menor a la deuda " +
                                  "<br>" +
                                  "Pago : " +
                                  pago[0].monto +
                                  "<br>" +
                                  "Deuda : " +
                                  contratoetiqueta.valor,
                                hora: moment().format("HH:mm"),
                                fecha: moment().format("YYYY-MM-DD"),
                                contrato: element.id
                              };
                              sails.request(
                                "POST http://localhost:1337/api/mensaje",
                                message,
                                function(err, response, body) {
                                  if (err) {
                                    sails.log.debug(err);
                                  }
                                  if (!body.success) {
                                    sails.log.debug("error en el registro");
                                  }
                                }
                              );
                              //calcula nuevo valor del pago
                            } else if (
                              pago[0].monto == contratoetiqueta.valor
                            ) {
                              nuevoValorPago =
                                (element.valor - element.pagado) /
                                contratoetiqueta.cantidadPeriodo;
                              Servicio.actualizarContratoEtiqueta(
                                element.id,
                                nuevoValorPago
                              ).then(retorno => {
                                console.log(nuevoValorPago);
                              });
                            }
                          }
                        }
                      });
                  }
                });
              }
            });
          }
        });

      // sails.log('antes de moriri \n')
      // sails.log(sails.hooks.cron.jobs.myFirstJob)
      // sails.hooks.cron.jobs.myFirstJob.stop();
      // sails.log('despues de de moriri \n')
      // sails.log(sails.hooks.cron.jobs.myFirstJob)
    },
    start: true,
    runOnInit: true
  }
};
