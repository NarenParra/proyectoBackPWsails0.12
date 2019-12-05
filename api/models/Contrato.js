/**
 * Contrato.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "contrato",
  attributes: {
    estado: {
      model: "estado"
    },
    observaciones: { // 
      type: "string"
    },
    concelo:{
      type:"boolean"
    },
    usuario: {
      model: "usuario"
    },
    creador: {
      model: "usuario"
    },
    contrato: {
      model: "contrato"
    },
    finalidad: {//TITULO
      type: "string"
    },
    valor: {
      type: "float"
    },
    pagado: {
      type: "float"
    },
    fechainicia: {
      type: "date"
    },
    contratociudad: {
      type: "string"
    }
    // fechatermina:"date"
  },
  connection: "mongodb",

  //model validation messages definitions
  // validationMessages: {
  //   //hand for i18n & l10n
  //   tipoContrato: {
  //     required: "Tipo de contrato requerido",
  //   },
  //   docVendedor: {
  //     required: "Username is required"
  //   }
  //}
};
