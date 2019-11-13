module.exports = {

  findArticulo: function funget(busqueda) {
    var ff = new Promise((rej, res) => {
      Articulo.find({
          id: busqueda
        })
        .then(function (variables) {
          if (!variables || variables.length == 0) {
            rej({
              success: false,
              massage: "No records fund "
            });
          }
          rej({
            success: true,
            massage: "Records fetched",
            data: variables
          });
        })
        .catch(function (err) {
          sails.log.debug(err);
          rej({
            success: false,
            massage: "Uneable fetch records"
          })
        });
    });
    return ff;
  },

  obtener: function funget(modelo) {
    var ff = new Promise((rej, res) => {
      modelo.find()
        .then(function (variables) {
          if (!variables || variables.length == 0) {
            rej({
              success: false,
              massage: "No records fund "
            });
          }
          rej({
            success: true,
            massage: "Records fetched",
            data: variables
          });
        })
        .catch(function (err) {
          sails.log.debug(err);
          rej({
            success: false,
            massage: "Uneable fetch records"
          })
        });
    });
    return ff;
  },

  obtenerC: function funget(modelo) {
    var ff = new Promise((rej, res) => {
      modelo.find()
        .then(function (variables) {
          if (!variables || variables.length == 0) {
            rej({
              success: false,
              massage: "No records fund "
            });
          } else {
            variables.forEach(element => {
              Estado.find({
                where: {
                  id: element.estado
                }
              }).then(function (datos) {
                sails.log(variables.estado)
                variables.estado = datos.titulo;
                rej({
                  success: true,
                  massage: "Records fetched",
                  data: element
                });
              })
            });

          }

        })
        .catch(function (err) {
          sails.log.debug(err);
          rej({
            success: false,
            massage: "Uneable fetch records"
          })
        });
    });
    return ff;
  },

  obtenerP: function funget(modelo, idc) {
    var ff = new Promise((rej, res) => {
      modelo.find({
          where: {
            contrato: idc
          }
        })
        .then(function (variables) {
          if (!variables || variables.length == 0) {
            rej({
              success: false,
              massage: "No records fund "
            });
          }
          rej({
            success: true,
            massage: "Records fetched",
            data: variables
          });
        })
        .catch(function (err) {
          sails.log.debug(err);
          rej({
            success: false,
            massage: "Uneable fetch records"
          })
        });
    });
    return ff;
  },

  obtenerUoR: function funget(modelo, idc) {
    var ff = new Promise((rej, res) => {
      modelo.find({
          where: {
            id: idc
          }
        })
        .then(function (variables) {
          if (!variables || variables.length == 0) {
            rej({
              success: false,
              massage: "No records fund "
            });
          }
          rej({
            success: true,
            massage: "Records fetched",
            data: variables
          });
        })
        .catch(function (err) {
          sails.log.debug(err);
          rej({
            success: false,
            massage: "Uneable fetch records"
          })
        });
    });
    return ff;
  },

  obtenerU: function funget(modelo, idc) {
    var ff = new Promise((rej, res) => {
      modelo.findOne({
          where: {
            docid: idc
          }
        })
        .then(function (variables) {
          if (!variables || variables.length == 0) {
            rej({
              success: false,
              massage: "No records fund "
            });
          }
          rej({
            success: true,
            massage: "Records fetched",
            data: variables
          });
        })
        .catch(function (err) {
          sails.log.debug(err);
          rej({
            success: false,
            massage: "Uneable fetch records"
          })
        });
    });
    return ff;
  },

  crearContratoEtiqueta: function funcreate(parametros, contrato, valor, valorletra, fechainicio, cantidadperiodo, unidadperiodo, descripcion) {
    var ff = new Promise((rej, res) => {
      Etiqueta.findOne({
          slug: parametros
        })
        .then((etiqueta) => {

          ContratoEtiqueta.create({
              titulo: etiqueta.titulo,
              etiqueta: etiqueta.id,
              contrato: contrato,
              valor: valor,
              valorDescripcion: valorletra,
              fecha: fechainicio,
              descripcion: descripcion,
              cantidadPeriodo: cantidadperiodo,
              unidadPeriodo: unidadperiodo
            })
            .then(function (contratoetiqueta) {
              return rej({
                success: true,
                massage: "Creado Correctamente ",
                id: contratoetiqueta.id
              });
            })
            .catch(err => {
              return rej({
                success: false,
                massage: "An Error in Register",
                'err': err
              });
            })
        })
        .catch(err => {
          return rej({
            success: true,
            massage: "Etiqueta no Found  ",
            'err': err
          });
        });
    });
    return ff;
  },

  crearContratoUsuario: function funcreate(usuario, contrato, rol) {

    var ff = new Promise((rej, res) => {
      var iduser = null
      if (typeof usuario == 'object') {
        var iduser = usuario.id
      }

      Rol.findOne({
          slug: rol
        })
        .then((rolb) => {

          ContratoUsuario.create({
              contrato: contrato,
              usuario: iduser,
              rol: rolb.id
            })
            .then(function (contratoUsuario) {
              return rej({
                success: true,
                massage: "Creado Correctamente ",
              });
            })
            .catch(err => {
              return rej({
                success: false,
                massage: "An Error in Register",
                'err': err
              });
            })
        })
        .catch(err => {
          return rej({
            success: true,
            massage: "Rol no Found  ",
            'err': err
          });
        });
    });
    return ff;
  },

  crearContratoArticulo: function funcreate(parametros, contrato, etiqueta, valor, cantidad) {
    var ff = new Promise((rej, res) => {
      Articulo.findOne({
          slug: parametros
        })
        .then((articulo) => {
          var idart = null
          //sails.log.debug(req.param("titulo"), estado.id)
          if (typeof articulo == 'object') {
            idart = articulo.id
          }
          ContratoArticulo.create({
              articulo: idart,
              contrato: contrato,
              contratoEtiqueta: etiqueta,
              precioVenta: valor,
              cantidad: cantidad
            })
            .then(function (contratoArticulo) {
              return rej({
                success: true,
                massage: "Creado Correctamente ",
                id: ""
              });
            })
            .catch(err => {
              return rej({
                success: false,
                massage: "An Error in Register contrato articulo",
                'err': err
              });
            })
        })
        .catch(err => {
          return rej({
            success: true,
            massage: "Articulo no Found  ",
            'err': err
          });
        });
    });
    return ff;
  },


  crearMensaje: function (titulo, descripcion, contrato, hora, fecha) {
    var ff = new Promise((rej, res) => {
      Mensaje.create({
          titulo: titulo,
          descripcion: descripcion,
          hora: hora,
          fecha: fecha,
          contrato: contrato
        })
        .then(function (mensaje) {
          return rej({
            success: true,
            massage: "Creado Correctamente ",
            data: mensaje
          });
        })
        .catch(err => {
          return rej({
            success: true,
            massage: "Error crear mensaje ",
            'err': err
          });
        });
    })
    return ff
  },

  actualizarContratoEtiqueta: function (contrato, valor) {
    var ff = new Promise((rej, res) => {
      ContratoEtiqueta.update({
          contrato: contrato,
          titulo: 'Precio'
        }, {
          valor: valor
        })
        .then(function (cone) {
          return rej({
            success: true,
            massage: "Creado Correctamente ",
            data: cone
          });
        })
        .catch(err => {
          return rej({
            success: true,
            massage: "Error crear mensaje ",
            'err': err
          });
        });
    })
    return ff
  }
  // sayHello: function sayHelloService(llegada) {
  //   return 'Hello I am servicio'+llegada;
  // }
};
