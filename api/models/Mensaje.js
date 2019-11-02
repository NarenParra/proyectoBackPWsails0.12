/**
 * Mensaje.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    titulo:{
      type:"string"
    },
    descripcion:{
      type:"string"
    },
    hora:{
      type:"string"
    },
    fecha:{
      type:"date"
    },
    contrato:{
      model:"contrato"
    }
  }
};

