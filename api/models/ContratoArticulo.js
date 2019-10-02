/**
 * ContratoArticulo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    articulo: {
      model: "articulo"
    },
    cantidad: {
      type: "integer"
    },
    precioventa: {
      type: "float"
    },
    total: {
      type: "float"
    },
    entregado: {
      model: "estado"
    },
    contrato: {
      model: "contrato"
    },

  }
};
