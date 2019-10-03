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


  crearContratoEtiqueta: function funcreate(parametros,contrato,valor,valorletra,fechainicio,descripcion){
    var ff = new Promise((rej,res)=>{
     
      Etiqueta.findOne({
        slug: parametros
      })
      .then((etiqueta) => {
        
        if (typeof etiqueta == 'object') {
          
          ContratoEtiqueta.create({titulo:etiqueta.titulo,etiqueta:etiqueta.id,contrato:contrato,valor:valor,valorDescripcion:valorletra,fecha:fechainicio,descripcion:descripcion})
            .then(function (contratoetiqueta) {
              return rej({
                success: true,
                massage: "Creado Correctamente ",
                id:contratoetiqueta.id
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

  crearContratoUsuario: function funcreate(parametros,contrato,fechainicio,descripcion){

    var ff = new Promise((rej,res)=>{
     
      ROL.findOne({
        slug: parametros
      })
      .then((etiqueta) => {
        
        if (typeof etiqueta == 'object') {
          
          ContratoUsuario.create({titulo:etiqueta.titulo,etiqueta:etiqueta.id,contrato:contrato,fecha:fechainicio,descripcion:descripcion})
            .then(function (contratoetiquetaprecio) {
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

  crearContratoArticulo: function funcreate(parametros,contrato,etiqueta,valor){
    var ff = new Promise((rej,res)=>{
      Articulo.findOne({
        slug: parametros
      })
      .then((articulo) => {
        
        if (typeof articulo == 'object') {
          //sails.log.debug(req.param("titulo"), estado.id)
          ContratoArticulo.create({articulo:articulo.id,contrato:contrato,contratoEtiqueta:etiqueta, precioVenta:valor})
            .then(function (contratoArticulo) {
              return rej({
                success: true,
                massage: "Creado Correctamente ",
                id:""
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
