module.exports.cron = {
  myFirstJob: {
    schedule: '7 * * * * *',
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
                        var periodo =contratoetiqueta
                      }
                      else if(contratoetiqueta.descripcion == "De forma periodica"){
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
