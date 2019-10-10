/**
 * ContratoUsuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    contrato: {
      model: "contrato"
    },
    usuario: {
      model: "usuario"
    },
    rol: {
      model: "rol"
    },
    creador: {
      model: "usuario"
    },
    /// valor momentaneo a falta de aser etiqueta lugar almacena el lugar de expedicion del documento del usuario
    descripcion:{
      type:"string"
    }
  }
  
};
