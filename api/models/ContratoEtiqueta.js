/**
 * ContratoEtiqueta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    titulo: {
      type: "string"
    },
    etiquetaDe: {
      type: "string"
    },
    descripcion: {
      type: "string"
    },
    contrato: {
      type: "contrato"
    },
    total: {
      type: "float"
    },
    etiqueta: {
      type: "etiqueta"
    },
    valor: {
      type: "float"
    }
  }
};
