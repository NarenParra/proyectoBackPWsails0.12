/**
 * ContratoArticuloController
 *
 * @description :: Server-side logic for managing contratoarticuloes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  get: function (req, res) {

    ContratoArticulo.find({
      contrato:req.param('idc')
    }).populate('articulo').exec((err,carticulo)=>{
      if(err){
        res.serverError(err);
      }
      if(!carticulo){
        return res.send({
          success: false,
          massage: "Articulo no Found  ",
        });
      }else{
        res.send(carticulo)
      }
    })
  },
};
