Ext.define('vyl.ux.form.Rutfield', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.rut',
    xtype: 'rut',
    
    config: {
        obligatorio: false
    },

    placeholder: 'xx.xxx.xxx-x',
    inputMask: '99.999.999-9',

    fieldLabel: 'RUT',
    
    constructor : function(config) {
        var me = this;

        me.callParent(arguments);
        me.initConfig(config);
    }
});