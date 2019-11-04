/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: {
      type: "string"
    },
    email:{
      type:"string"
    },
    nombre: {
      type: "string"
    },
    apellido: {
      type: "string"
    },
    docid: {
      type: "string"
    },
    tipodocid: {
      type: "string"
    },
    tipopersona: {
      type: "string"
    },
    direccion:{
      type:"string"
    },
    expediciondoc:{
      type:"string"
    }
  }
};
