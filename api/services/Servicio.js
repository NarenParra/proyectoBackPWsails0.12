module.exports = {

  // mostrar:  function funget(modelo) {
  //    var ff= new Promise ((rej,res)=>{
  //      modelo.find({})
  //     .then(function (variables) {
  //       if (variables.length == 0) {
  //         res({
  //           success: false,
  //           message: "No records fund"
  //         }); 
  //       }
  //        res({
  //         success: true,
  //         message: "Records fetched",
  //         data: variables
  //       });
  //     })
  //     .catch(function (err) {
  //       sails.log.debug(err);
  //        res({
  //         success: false,
  //         message: "Uneable fetch records"
  //       });
  //     });
  //   })
  //   return ff;
  // }
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

  crear: function funcreate(){
    var ff = new Promise((req,res)=>{
      
    });
    return ff;
  }
  // sayHello: function sayHelloService(llegada) {
  //   return 'Hello I am servicio'+llegada;
  // }
};
