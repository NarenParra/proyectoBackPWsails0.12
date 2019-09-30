var Servicio = {

  async function name(model){
    return new Promise(req,res)
  }
    


  mostrar: function hagaalgo(Modelo) {

    Modelo.find()
      .then(function (variables) {
        if (variables.length == 0) {
          return res.send({
            success: false,
            message: "No records fund (contratos)"
          });
        }
        return res.send({
          success: true,
          message: "Records fetched",
          data: variables
        });
      })
      .catch(function (err) {
        sails.log.debug(err);
        return ({
            success: false,
            message: "Uneable fetch records"
          })
      });
  }
  // sayHello: function sayHelloService(llegada) {
  //   return 'Hello I am servicio'+llegada;
  // }
};


module.exports = Servicio;
