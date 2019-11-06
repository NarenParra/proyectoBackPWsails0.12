var moment = require('moment');
moment.locale('es');

var contador = 0;
var titulo = "";
var descripcion = "";
var fecha = "";
var hora = "";
var now = "";
module.exports.cron = {


   myFirstJob: {
     schedule: '6 8 * * * *',
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
                         if (contratoetiqueta.descripcion == "En una fecha determinada posterior" || contratoetiqueta.descripcion == "De forma periodica") {

                           var unidad = "";
                           if (contratoetiqueta.unidadPeriodo == 'Días') {
                             unidad = "days";
                           } else if (contratoetiqueta.unidadPeriodo == 'Meses' || contratoetiqueta.unidadPeriodo == 'Mensuales') {
                             unidad = "month"
                           } else if (contratoetiqueta.unidadPeriodo == 'Años' || contratoetiqueta.unidadPeriodo == 'Anuales') {
                             unidad = "year"
                           }

                           var inicio = moment(element.fechainicia).add(1, 'days').format("YYYY-MM-DD");
                           console.log("inicio")
                           console.log(inicio)
                           var inicioCantidad = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                           console.log("inicio mas cantidad aplazada")
                           console.log(inicioCantidad)
                           now = moment().format("YYYY-MM-DD");
                           var diasParaPago = moment(inicioCantidad).diff(now, 'days');
                           console.log("dias")
                           console.log(diasParaPago)

                           console.log(contador++)

                           if (diasParaPago > 0 && diasParaPago <= 3) {
                             titulo = "Pocos dias para el pago"
                             descripcion = 'Debe pagar pronto, faltan ' + diasParaPago + ' dias para el pago'
                             hora = moment().format('HH:mm');
                             fecha = now
                             Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                               .then((mensaje) => {
                                 console.log(mensaje)
                               })
                           } else if (moment(now).isSame(inicioCantidad)) {
                             titulo = "Hoy, dia de pago"
                             descripcion = "Flatan 0 dias para el pago"
                             hora = moment().format('HH:mm');
                             fecha = now
                             Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                               .then((mensaje) => {
                                 console.log(mensaje)
                               })

                           } else if (moment(now).isAfter(inicioCantidad)) {
                             titulo = "Pago atrazado"
                             descripcion = "el pago esta atrazado" + diasParaPago + ' dias '
                             hora = moment().format('HH:mm');
                             fecha = now
                             Servicio.crearMensaje(titulo, descripcion, element.id, hora, fecha)
                               .then((mensaje) => {
                                 console.log(mensaje)
                               })

                              //calcular intereses
                           }

                         }

                       } else {
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
                                   })
                                 } else if (pago[0].monto < element.valor) {

                                   titulo = "Pago menor a la deuda"
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
                           // logica del pago por cuotas cuando hay pagos
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
