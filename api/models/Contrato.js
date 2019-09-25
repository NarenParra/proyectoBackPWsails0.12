/**
 * Contrato.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "variables",
  attributes: {
    tipoContrato: {
      type: "string",
      required: true
    },
    nombVendedor: {
      type: "string"
    },
    docVendedor: {
      type: "number",
      required: true
    },
    docExpeVende: {
      type: "string"
    },
    nombComprador: {
      type: "string"
    },
    docComprador: {
      type: "number"
    },
    docExpeCompra: {
      type: "string"
    },
    bien: {
      type: "string"
    },
    dineroS: {
      type: "string"
    },
    dineroN: {
      type: "number"
    },
    descripValor: {
      type: "string"
    },
    // tradicion: {
    //   type: "string",
    //   required:true
    // },
    gastos: {
      type: "string"
    },
    contratoCiudad: {
      type: "string"
    },
    fechaContrato: {
      type: "date"
    },
    tipoDocComp: {
      type: "string"
    },
    tipoDocVend: {
      type: "string"
    }
  },

  //model validation messages definitions
  validationMessages: {
    //hand for i18n & l10n
    tipoContrato: {
      required: "Tipo de contrato is required"
    },
    docVendedor: {
      required: "Documento del vendedors is required"
    }
  }
};
