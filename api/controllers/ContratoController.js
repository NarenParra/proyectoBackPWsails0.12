/**
 * ContratoController
 *
 * @description :: Server-side logic for managing Contratoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  get: function(req, res) {
    Contrato.find()
      .then(function(variables) {
        if (!variables || variables.length == 0) {
          return res.send({
            success: false,
            message: "No records fund"
          });
        }
        return res.send({
          success: true,
          message: "Records fetched",
          data: variables
        });
      })
      .catch(function(err) {
        sails.log.debug(err);
        return (
          res,
          send({
            success: false,
            message: "Uneable fetch records"
          })
        );
      });
  },
  create: function(req, res) {
    sails.log.debug(req.allParams());
    Contrato.create(req.allParams())
      .then(function(variables) {
        return res.send({
          success: true,
          massage: "Creado Correctamente ",
          data: variables
        });
      })
      .catch(function(error) {
        sails.log.debug(error.Errors);
        if (error.invalidAttributes) {
          return res.json(422, {
            validationErrors: error.Errors
          });
        }
      });
  }
};
