/**
 * Pagos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    contrato:{
      model: "contrato"
    },
    usuario:{
      model:"usuario"
    },
    fecha:{
      type:"date"
    },
    monto:{
      type:"float"
    },
    tipo:{
      type:"string"
    }
  }
};

