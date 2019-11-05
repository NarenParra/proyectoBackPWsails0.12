/**
 * ArticuloController
 *
 * @description :: Server-side logic for managing articuloes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    get: function (req,res) {
        Articulo.findOne({
            slug:req.param("idc")
        }).exec((err,articulo)=>{
            if(err){
                res.serverError(err);
            }
            if(!articulo){
                return res.send({
                    success: false,
                    massage: "Articulo no Found ",
                  });
            }else{
                return res.send({
                    success: true,
                    massage: "Articulo Found ",
                    data:articulo
                  });
            }
        });
    }
};

