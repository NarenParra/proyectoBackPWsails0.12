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
    valorDescripcion: {
      type: "string"
    },
    contrato: {
      model: "contrato"
    },
    total: {
      type: "float"
    },
    etiqueta: {
      model: "etiqueta"
    },
    // guarda el acumulado de los pagos
    valor: {
      type: "float"
    },
    contidadPeridod:{
      type:"integer"
    },
    unidadPeriodo:{
      type:"string"
    },
    /// cantidadperiodo y unidadperiodo
    // contratoArticulo:{
    //   model:"contratoarticulo"
    // },
    fecha:{
      type:"date"
    }
  }
};
