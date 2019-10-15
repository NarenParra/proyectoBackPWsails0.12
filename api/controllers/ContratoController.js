/**
 * ContratoController
 *
 * @description :: Server-side logic for managing Contratoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {

    Servicio.obtener(Contrato)
      .then(function (ff) {
        res.send(ff)
        //sails.log.debug(ff)
      })
      .catch(function (err) {
        return res.serverError(err);
      });
  },

  create: function (req, res) {

    Estado.findOne({
        slug: req.param("estado")
      })
      .then((estado) => {

        // sails.log.debug(req.param("userlog"));
        Usuario.findOne({
          docid: req.param("userlog")
        }).then((usuariolog) => {

          Usuario.findOne({
              docid: req.param("usercomp")
            }).then((usuariocom) => {

              var idusercom = null;
              var valorv = null;
              if (typeof usuariocom == 'object' && estado.slug == 'borrador') {
                idusercom = usuariocom.id
              }

              Contrato.create({
                  estado: estado.id,
                  observaciones: req.param('observaciones'),
                  valor: req.param('valor'),
                  fechainicia: req.param('fechainicia'),
                  contratoCiudad: req.param('contratoCiudad'),
                  usuario: idusercom,
                  creador: usuariolog.id,
                  contrato: req.param('padre'),
                  finalidad: req.param('finalidad')
                })
                .then(function (contrato) {

                  Servicio.crearContratoEtiqueta(req.param('slugObj'), contrato.id, 0, "", "", "")
                    .then(function (fce) {
                      Servicio.crearContratoArticulo(req.param('slugArt'), contrato.id, fce.id, contrato.valor)
                        .then(function (fca) {})
                    })

                    .then(function (ff) {
                      Servicio.crearContratoEtiqueta(req.param('slugPre'), contrato.id, contrato.valor, req.param('valorletra'), "", req.param('descripcion'))
                        .then(function (fce) {})

                    }).then(function (ff) {
                      Servicio.crearContratoEtiqueta(req.param('slugAcep'), contrato.id, 0, "", contrato.fechainicia, req.param('lugarContrato'))
                        .then(function (fcac) {
                          //res.send(fcac)
                        })
                    })
                    .then(function (ff) {

                      Servicio.crearContratoUsuario(usuariocom, contrato.id, "comprador", req.param("docExpeCompra"))
                        .then(function (fce) {
                          //res.send(fce)
                        })
                    })
                    .then(function (ff) {
                      Usuario.findOne({
                        docid: req.param("uservend")
                      }).then((usuariovend) => {
                        //sails.log.debug(usuariovend)

                        Servicio.crearContratoUsuario(usuariovend, contrato.id, "vendedor", req.param("docExpeVende"))
                          .then(function (fce) {
                            // sails.log.debug(res.send(fce))
                            res.send(fce)
                          })

                      })
                    })
                    .catch(function (err) {
                      return res.send(err);
                    })
                })
                .catch(err => {
                  return res.send({
                    success: false,
                    massage: "An Error in Register general",
                    'err': err
                  });
                })

            })
            .catch(err => {
              return res.send({
                success: false,
                massage: "usuario comprador no Found  ",
                'err': err
              });
            })
        }).catch(err => {
          return res.send({
            success: false,
            massage: "Usuariolog no Found ",
            'err': err
          });
        })
      })
      .catch(err => {
        return res.send({
          success: false,
          massage: "Estado no Found  ",
          'err': err
        });
      })
  },

  update: function (req, res) {
    Estado.findOne({
        slug: req.param("estado")
      })
      .then((estado) => {
        sails.log.debug(estado.id)

        // sails.log.debug(req.param('id'))


        Contrato.update(req.param('id'), {
            estado: estado.id,
            observaciones: req.param('observaciones'),
            valor: req.param('valor'),
            fechainicia: req.param('fechainicia'),
            contratoCiudad: req.param('contratoCiudad'),
            //usuario: idusercom,
            //debe ser tomado del usuario logueado
            creador: "5d96535058699210f8bdbd1d",
            finalidad: req.param('finalidad')
          })
          .then(function (contrato) {
            // update comprador

            if (req.param('uservend')) {
              Usuario.findOne({
                  docid: req.param('uservend')
                })
                .then(function (usuario) {

                  Rol.findOne({
                      slug: 'vendedor'
                    })
                    .then(function (rol) {
                      ContratoUsuario.update({
                          contrato: req.param('id'),
                          rol: rol.id
                        }, {
                          usuario: usuario.id,
                          descripcion: req.param('docExpeVende')
                        })
                        .then(function (uservend) {

                        })
                    })
                })
            }
            // update vendedor
            if (req.param('usercomp')) {

              Usuario.findOne({
                  docid: req.param('usercomp')
                })
                .then(function (usuario) {

                  Contrato.update(req.param('id'), {
                    usuario: usuario.id
                  }).then(function (vari) {
                    Rol.findOne({
                        slug: 'comprador'
                      })
                      .then(function (rol) {

                        ContratoUsuario.update({
                            contrato: req.param('id'),
                            rol: rol.id
                          }, {
                            usuario: usuario.id,
                            descripcion: req.param('docExpeCompra')
                          })
                          .then(function (usercomp) {})
                      })
                  })
                })
            }

            ContratoEtiqueta.find({
                contrato: req.param("id")
              })
              .then(function (contratoEtiqueta) {
                sails.log.debug(contratoEtiqueta)
                //update contrato articulo
                if (req.param('slugArt')) {
                  Articulo.findOne({
                    slug: req.param('slugArt')
                  }).then(function (articulo) {

                    ContratoArticulo.update({
                        contrato: req.param("id")
                      }, {
                        articulo: articulo.id
                      })
                      .then(function (upart) {
                        console.log('upart')
                        console.log(upart)
                      })
                  })
                }

                if (req.param('valor') || req.param('descripcion') || req.param('valorletra')) {
                  ContratoEtiqueta.update({
                    contrato: req.param("id"),
                    titulo: 'Precio'
                  }, {
                    valor: req.param('valor'),
                    valorDescripcion: req.param('valorletra'),
                    descripcion: req.param('descripcion')
                  }).then(function (precio) {
                    console.log(precio)
                  })
                }

                if (req.param('fechainicia') || req.param('contratoCiudad')) {
                  ContratoEtiqueta.update({
                    contrato: req.param("id"),
                    titulo: 'Aceptacion'
                  }, {
                    fecha: req.param('fechainicia'),
                    descripcion: req.param('contratoCiudad')
                  }).then(function (precio) {
                    console.log(precio)
                  })
                }

              }).catch(err => {
                sails.log.debug(err)
              })
            return res.send({
              'success': true,
              'massage': "Record Upadte",
              "data": contrato
            })
          })
          .catch(err => {
            return res.send({
              success: true,
              massage: "contrato no Found  ",
              'err': err
            });
          })
      })
      .catch(err => {
        return res.send({
          success: false,
          massage: "Estado no Found  ",
          'err': err
        });
      })

  },
};
