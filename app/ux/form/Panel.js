Ext.define('vyl.ux.form.Panel', {
    // Form que se vincula a un evento, por lo que lo primero que hace es tomar o crear el event y carga dinamicamente la botonera
    extend: 'Ext.form.Panel',
    xtype: 'uxform',

    url: '../do/jsonCall',

    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 90,
        margin: '0 0 5 6'
    },
    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 90,
        margin: '0 0 5 6'
    },

    frame: false,
    scrollable: 'y',
    bodyPadding: 5,
    minWidth: 970,

    margin: '5 5 0 5',
});