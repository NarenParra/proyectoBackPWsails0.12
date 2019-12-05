/**
 * ContratoController
 *
 * @description :: Server-side logic for managing Contratoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //obtiene contratos dependiendo el estado
  get: function(req, res) {
    Estado.findOne({
      slug: req.param("estado")
    }).exec((err, estado) => {
      if (err) {
        res.serverError(err);
      }
      if (!estado) {
        return res.send({
          success: false,
          massage: "An Error ",
          err: err
        });
      } else {
        Contrato.find({
          estado: estado.id
        }).exec((err, contrato) => {
          if (err) {
            res.serverError(err);
          }
          if (estado.length == 0) {
            return res.send({
              success: false,
              massage: "no hay contrato "
            });
          } else {
            return res.send({
              success: true,
              massage: "contrato ",
              data: contrato
            });
          }
        });
      }
    });
  },

  obtener: function(req, res) {
    Servicio.obtener(Contrato)
      .then(function(ff) {
        res.send(ff);
        //sails.log.debug(ff)
      })
      .catch(function(err) {
        return res.serverError(err);
      });
  },

  create: function(req, res) {
    Estado.findOne({
      slug: req.param("estado")
    })
      .then(estado => {
        Usuario.findOne({
          docid: req.param("userlog")
        })
          .then(usuariolog => {
            Usuario.findOne({
              docid: req.param("usercomp")
            })
              .then(usuariocom => {
                var idusercom = null;
                var valorv = null;
                if (
                  typeof usuariocom == "object" &&
                  estado.slug == "borrador"
                ) {
                  idusercom = usuariocom.id;
                }

                Contrato.create({
                  estado: estado.id,
                  observaciones: req.param("observaciones"),
                  valor: req.param("valor"),
                  pagado: req.param("pagado"),
                  cancelo: req.param("cancelo"),
                  fechainicia: req.param("fechainicia"),
                  contratociudad: req.param("contratoCiudad"),
                  usuario: idusercom,
                  creador: usuariolog.id,
                  contrato: req.param("padre"),
                  finalidad: req.param("finalidad")
                })
                  .then(function(contrato) {
                    //registro de contrato etiqueta
                    Servicio.crearContratoEtiqueta(
                      req.param("slugObj"),
                      contrato.id,
                      0,
                      "",
                      "",
                      0,
                      "",
                      ""
                    )
                      .then(function(fce) {
                        console.log("req.param('slugArt')");
                        console.log(req.param("slugArt"));

                        req.param("slugArt").forEach(articulo => {
                          Servicio.crearContratoArticulo(
                            articulo.articulo,
                            contrato.id,
                            fce.id,
                            contrato.valor,
                            articulo.cantidad
                          ).then(function(fca) {});
                        });
                      })
                      .then(function(ff) {
                        Servicio.crearContratoEtiqueta(
                          req.param("slugPre"),
                          contrato.id,
                          contrato.valor,
                          req.param("valorletra"),
                          "",
                          req.param("cantidadPeriodo"),
                          req.param("unidadPeriodo"),
                          req.param("descripcion")
                        ).then(function(fce) {});
                      })
                      .then(function(ff) {
                        Servicio.crearContratoEtiqueta(
                          req.param("slugAcep"),
                          contrato.id,
                          0,
                          "",
                          contrato.fechainicia,
                          0,
                          "",
                          req.param("lugarContrato")
                        ).then(function(fcac) {
                          //res.send(fcac)
                        });
                      })
                      .then(function(ff) {
                        //registro de contrato usuario comprador
                        Servicio.crearContratoUsuario(
                          usuariocom,
                          contrato.id,
                          "comprador"
                        ).then(function(fce) {
                          //res.send(fce)
                        });
                      })
                      .then(function(ff) {
                        Usuario.findOne({
                          docid: req.param("uservend")
                        }).then(usuariovend => {
                          //registro de contrato usuario vendedor
                          Servicio.crearContratoUsuario(
                            usuariovend,
                            contrato.id,
                            "vendedor"
                          ).then(function(fce) {
                            // sails.log.debug(res.send(fce))
                            res.send(fce);
                          });
                        });
                      })
                      .catch(function(err) {
                        return res.send(err);
                      });
                  })
                  .catch(err => {
                    return res.send({
                      success: false,
                      massage: "An Error in Register general",
                      err: err
                    });
                  });
              })
              .catch(err => {
                return res.send({
                  success: false,
                  massage: "usuario comprador no Found  ",
                  err: err
                });
              });
          })
          .catch(err => {
            return res.send({
              success: false,
              massage: "Usuariolog no Found ",
              err: err
            });
          });
      })
      .catch(err => {
        return res.send({
          success: false,
          massage: "Estado no Found  ",
          err: err
        });
      });
  },

  update: function(req, res) {
    Estado.findOne({
      slug: req.param("estado")
    })
      .then(estado => {
        Contrato.update(req.param("id"), {
          estado: estado.id,
          observaciones: req.param("observaciones"),
          valor: req.param("valor"),
          pagado: req.param("pagado"),
          cancelo: req.param("cancelo"),
          fechainicia: req.param("fechainicia"),
          contratociudad: req.param("contratoCiudad"),
          //usuario: idusercom,
          //debe ser tomado del usuario logueado
          creador: "5d96535058699210f8bdbd1d",
          finalidad: req.param("finalidad")
        })
          .then(function(contrato) {
            // update vendedor
            console.log("entra then");
            if (req.param("uservend")) {
              Usuario.findOne({
                docid: req.param("uservend")
              }).then(function(usuario) {
                console.log("entra vendedor");
                Rol.findOne({
                  slug: "vendedor"
                }).then(function(rol) {
                  ContratoUsuario.update(
                    {
                      contrato: req.param("id"),
                      rol: rol.id
                    },
                    {
                      usuario: usuario.id
                    }
                  ).then(function(uservend) {});
                });
              });
            }
            // update  comprador
            if (req.param("usercomp")) {
              Usuario.findOne({
                docid: req.param("usercomp")
              }).then(function(usuario) {
                Contrato.update(req.param("id"), {
                  usuario: usuario.id
                }).then(function(vari) {
                  Rol.findOne({
                    slug: "comprador"
                  }).then(function(rol) {
                    ContratoUsuario.update(
                      {
                        contrato: req.param("id"),
                        rol: rol.id
                      },
                      {
                        usuario: usuario.id,
                        descripcion: req.param("docExpeCompra")
                      }
                    ).then(function(usercomp) {});
                  });
                });
              });
            }
            //actualiza contrato etiqueta
            ContratoEtiqueta.find({
              contrato: req.param("id")
            })
              .then(function(contratoEtiqueta) {
                sails.log.debug(contratoEtiqueta);

                if (req.param("slugArt").length > 0) {
                  ContratoArticulo.destroy({
                    contrato: req.param("id")
                  }).then();

                  //console.log("req.param('slugArt')")
                  req.param("slugArt").forEach(articulo => {
                    Articulo.findOne({
                      slug: articulo.articulo
                    }).then(function(articulo2) {
                      sails.log.debug(articulo2);
                      ContratoArticulo.create({
                        contrato: req.param("id"),
                        articulo: articulo2.id,
                        precioVenta: 0,
                        cantidad: articulo.cantidad
                      }).then(function(upart) {
                        // console.log('upart')
                        //console.log(upart)
                      });
                    });
                  });
                }

                if (
                  req.param("valor") ||
                  req.param("descripcion") ||
                  req.param("valorletra")
                ) {
                  ContratoEtiqueta.update(
                    {
                      contrato: req.param("id"),
                      titulo: "Precio"
                    },
                    {
                      valor: req.param("valor"),
                      valorDescripcion: req.param("valorletra"),
                      descripcion: req.param("descripcion"),
                      cantidadPeriodo: req.param("cantidadPeriodo"),
                      unidadPeriodo: req.param("unidadPeriodo")
                    }
                  ).then(function(precio) {
                    // console.log(precio)
                  });
                }

                if (req.param("fechainicia") || req.param("contratoCiudad")) {
                  ContratoEtiqueta.update(
                    {
                      contrato: req.param("id"),
                      titulo: "Aceptacion"
                    },
                    {
                      fecha: req.param("fechainicia"),
                      descripcion: req.param("contratoCiudad")
                    }
                  ).then(function(precio) {
                    // console.log(precio)
                  });
                }
              })
              .catch(err => {
                sails.log.debug("err");
                sails.log.debug(err);
              });
            return res.send({
              success: true,
              massage: "Record Upadte",
              data: contrato
            });
          })
          .catch(err => {
            return res.send({
              success: true,
              massage: "contrato no Found  ",
              err: err
            });
          });
      })
      .catch(err => {
        return res.send({
          success: false,
          massage: "Estado no Found  ",
          err: err
        });
      });
  }
};
