/**
 * PagoController
 *
 * @description :: Server-side logic for managing pagoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req,res) {
        Pago.create({
            contrato: req.param('contrato'),
            fecha: req.param('fecha'),
            monto:req.param("monto"),
            tipo: req.param('tipo')
        }).then(function (pago) {

            if(pago){
                return res.send({
                 success: true,
                 massage: "Creado Correctamente "
               });
             }else{
               return res.send({
                 success: false,
                 massage: "No Creado Correctamente "
               });
             }
            
        }).catch(function (err) {
            return res.serverError(err);
          });
    }
};

