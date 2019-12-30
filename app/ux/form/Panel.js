Ext.define('vyl.ux.form.Panel', {
    // Formulario tipico sin evento asociado
    extend: 'Ext.form.Panel',
    xtype: 'uxform',

    url: '../do/jsonCall',

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