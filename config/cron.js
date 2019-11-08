var moment = require('moment');
moment.locale('es');

var contador = 0;
var titulo = "";
var descripcion = "";
var fecha = "";
var hora = "";
var now = "";
var inicio = "";
var fechapago = "";
var diasParaPago = "";
module.exports.cron = {


  myFirstJob: {
    //schedule: '6 * * * * *',
    schedule: '6 * * * * *',
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
                    }).exec((err, pago) => {
                      if (err) {
                        return res.serverError(err);
                      }
                      if (pago.length == 0) {
                        if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {

                          var unidad = "";
                          if (contratoetiqueta.unidadPeriodo == 'Días') {
                            unidad = "days";
                          } else if (contratoetiqueta.unidadPeriodo == 'Meses' || contratoetiqueta.unidadPeriodo == 'Mensuales') {
                            unidad = "month"
                          } else if (contratoetiqueta.unidadPeriodo == 'Años' || contratoetiqueta.unidadPeriodo == 'Anuales') {
                            unidad = "year"
                          }

                          inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                          fechapago = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                          now = moment().format("YYYY-MM-DD");
                          diasParaPago = moment(fechapago).diff(now, 'days');

                          if (diasParaPago > 0 && diasParaPago <= 3) {
                            titulo = "Faltan pocos días para realizar el pago"
                            descripcion = 'EL contrato se debe pagar pronto, faltan ' + diasParaPago + ' días para el pago'
                            hora = moment().format('HH:mm');
                            fecha = now
                            Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                              .then((mensaje) => {
                                console.log(mensaje)
                              })
                          } else if (moment(now).isSame(fechapago)) {
                            titulo = "Hoy, día de pago"
                            descripcion = "Flatan 0 dias para el pago"
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
                              descripcion = "El pago esta atrasado" + diasParaPago + '  días ';
                              hora = moment().format('HH:mm');
                              fecha = now
                              Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                .then((mensaje) => {
                                  console.log(mensaje)
                                })
                            } else if (diasParaPago * -1 > 60) {
                              titulo = "Mora mayor a dos meses"
                              descripcion = "El pago esta atrasado" + diasParaPago + '  días. ' + "El caso fue enviado a jurídica";
                              hora = moment().format('HH:mm');
                              fecha = now
                              Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                                .then((mensaje) => {
                                  console.log(mensaje)
                                })
                              //enviar email a juridica

                            }
                          }
                        } else if (contratoetiqueta.descripcion == "De forma periodica") {

                          if (contratoetiqueta.unidadPeriodo == 'Días') {
                            unidad = "days";
                          } else if (contratoetiqueta.unidadPeriodo == 'Mensuales') {
                            unidad = "month"
                          } else if (contratoetiqueta.unidadPeriodo == 'Anuales') {
                            unidad = "year"
                          }

                          if (unidad == "year" || unidad == "month") {
                            inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                            fechapago = moment(inicio).add(1, unidad).format("YYYY-MM-DD");
                          }else{
                            fechapago = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                          }
                          console.log(fechapago)
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
                              }
                            })
                          }

                        } else if (contratoetiqueta.descripcion == "De forma periodica") {
                          if (element.finalidad == "Compraventa") {
                            var sumadepagos = 0;
                            pago.forEach(pay => {
                              sumadepagos += pay.monto
                            });


                            // Estado.findOne({
                            //   slug: "finalizado"
                            // }).exec((err, stade) => {})
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
