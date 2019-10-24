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
            contrato.forEach(element => {
              if (element.estado.slug == 'iniciado') {
                if (element.cancelo == true) {
                  console.log('ya esta pagado')
                  ///camba estado a finalizado
                  Estado.findOne({
                    slug: 'finalizado'
                  }).exec((err, estado) => {
                    if (err) {
                      return res.serverError(err);
                    }
                    if (estado == 0) {
                      return res.serverError("No hay Estados");
                    } else {
                      Contrato.update(element.id, {
                        estado: estado.id
                      }).exec((err, contratoup) => {
                        if (err) {
                          return res.serverError(err);
                        }
                      })
                    }

                  })
                } else {
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
                      if (contratoetiqueta.descripcion == "En una fecha determinada posterior") {
                        console.log('entra fecha otra')
                        // va la logica de que hay que hacer con fecha posterior
                        var unidad="";
                        if (contratoetiqueta.unidadPeriodo == 'Días') {
                          unidad= "days";
                        } else if (contratoetiqueta.unidadPeriodo == 'Meses') { 
                          unidad="month"
                        } else if (contratoetiqueta.unidadPeriodo == 'Años') {
                          unidad="year"
                        }

                  

                        console.log("unidad")
                        console.log(unidad)
                        var inicio = moment(element.fechainicia).add(1,'days').format("YYYY-MM-DD");
                        console.log("inicio")
                        console.log(inicio)
                        var inicioCantidad = moment(inicio).add(contratoetiqueta.cantidadPeriodo, unidad).format("YYYY-MM-DD");
                        console.log("inicioCantidad")
                        console.log(inicioCantidad)
                        var now = moment().format("YYYY-MM-DD");
                        var diferencia = moment(inicioCantidad).diff(inicio, 'days');
                        console.log("diferencia")
                        console.log(diferencia)

                        console.log(contador++)

                        if (diferencia >= 1 && diferencia <= 3) {
                          console.log('debe pagar pronto')
                          // cumo sacar los usuarios?

                          // estructura Email
                          // let mailOptions = {
                          //   from: "vendedor@gmail.com",
                          //   to: "comprador@gmail.com",
                          //   subject: `Not a GDPR update ;)`,
                          //   text: `Hi there, this email was automatically sent by us`
                          // };
                        } else if (moment(now).isSame(inicioCantidad)) {
                          console.log('Dia del pago')
                        } else if (moment(moment(now)).isAfter(inicioCantidad)) {
                          console.log('Pago atrazado');

                        }


                      } else if (contratoetiqueta.descripcion == "De forma periodica") {
                        console.log('PERIODICA')
                      }
                    }
                  })
                }

              } else {
                // console.log(element)
              }

            });
          }
        })
    }
  }
};
