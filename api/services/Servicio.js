module.exports = {

  obtener: function funget(modelo) {
    var ff = new Promise((rej, res) => {
      modelo.find()
        .then(function (variables) {
          if (!variables || variables.length == 0) {
             rej({
              success: false,
              message: "No records fund (contratos)"
            });
          }
           rej({
            success: true,
            message: "Records fetched",
            data: variables
          });
        })
        .catch(function (err) {
          sails.log.debug(err);
           
            rej({
              success: false,
              message: "Uneable fetch records"
            })
        });
    });
    return ff;
  },

  crearEtiquetaObjeto: function funcreate(parametros,contrato){
    var ff = new Promise((rej,res)=>{
      sails.log.debug("parametros");
      sails.log.debug(contrato);
      Etiqueta.findOne({
        slug: parametros
      })
      .then((etiqueta) => {
        
        if (typeof etiqueta == 'object') {
          //sails.log.debug(req.param("titulo"), estado.id)
          ContratoEtiqueta.create({etiqueta:etiqueta.id,contrato})
            .then(function (coontratoetiqueta) {
              //falta meter articulos aca
              sails.log.debug(coontratoetiqueta.id);
              return rej({
                success: true,
                massage: "Creado Correctamente "
              });
            })
            .catch(err => {
              return rej({
                success: false,
                massage: "An Error in Register",
                'err': err
              });
            })
        } else {
          return rej({
            success: true,
            massage: "Estado no Founddd",
            'err': err
          });
        }
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

  crearContratoArticulo: function funcreate(parametros,contrato){
    var ff = new Promise((rej,res)=>{
      sails.log.debug("parametros");
      sails.log.debug(parametros);
      Articulo.findOne({
        slug: parametros
      })
      .then((articulo) => {
        
        if (typeof articulo == 'object') {
          //sails.log.debug(req.param("titulo"), estado.id)
          sails.log.debug(articulo.id);
          ContratoArticulo.create({articulo:articulo.id,contrato})
            .then(function (coontratoetiqueta) {
              return rej({
                success: true,
                massage: "Creado Correctamente "
              });
            })
            .catch(err => {
              return rej({
                success: false,
                massage: "An Error in Register contrato articulo",
                'err': err
              });
            })
        } else {
          return rej({
            success: true,
            massage: "Estado no Founddd",
            'err': err
          });
        }
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
  }
  // sayHello: function sayHelloService(llegada) {
  //   return 'Hello I am servicio'+llegada;
  // }
};
