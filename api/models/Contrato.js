/**
 * Contrato.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName:'variables',
  attributes: {
    tipoContrato:{
      type:'string'
    },
    nombVendedor:{
      type:'string'
    },
    docVendedor: {
      type:'number'
    },
    docExpeVende: {
      type:'string'
    },
    nombComprador: {
      type:'string'
    },
    docComprador: {
      type:'number'
    },
    docExpeCompra: {
      type:'string'
    },
    bien: {
      type:'string'
    },
    dineroS: {
      type:'string'
    },
    dineroN: {
      type:'number'
    },
    descripValor: {
      type:'string'
    },
    tradicion: {
      type:'string'
    },
    gastos: {
      type:'string'
    },
    contratoCiudad: {
      type:'string'
    },
    fechaContrato: {
      type:'string'
    },
    tipoDocComp: {
      type:'string'
    },
    tipoDocVend: {
      type:'string'
    }
  }, 
  connection:'mongodb',
};

