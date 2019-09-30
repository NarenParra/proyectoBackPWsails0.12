/**
 * Contrato.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "contrato",
  attributes: {
    //contrato
    estado:{
      model:"estado"
    },
    observaciones:{
      type:"string"
    },
    // usuario:{
    //   type:"usuario"
    // },
    // creador:{
    //   type:"usuario"
    // },
    // contrato:{
    //   model:"contrato"
    // },
    // finalidad:{
    //   type:"string"
    // },
    valor:{
      type:"float"
    },
    // pagado:{
    //   type:"float"
    // },
    fechainicia:{
      type:"date"
    },
    contratoCiudad:{
      type:"string"
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
