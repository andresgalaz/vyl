Ext.define('vyl.ux.form.Numberfield', {
    // La unica diferencia es que permite bind de allowblank
    extend: 'Ext.form.field.Number',
    alias: 'widget.uxnumberfield',
    xtype: 'uxnumberfield',
    
    config: {
        obligatorio: false
    },
    
    constructor : function(config) {
        var me = this;

        me.callParent(arguments);
        me.initConfig(config);
    },

    // override del metodo generado
    updateObligatorio: function(value) {
        this.allowBlank = !value;
    }
});