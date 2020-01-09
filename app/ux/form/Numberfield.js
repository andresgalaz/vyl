Ext.define('vyl.ux.form.Numberfield', {
    // Permite bind de allowblank @cfg obligatorio y agrega separador de miles con @cfg allowThousandSeparator
    extend: 'Ext.form.field.Number',
    // extend: 'overrides.Numberfield',
    alias: 'widget.uxnumberfield',
    xtype: 'uxnumberfield',
    
    config: {
        obligatorio: false
    },
    
    constructor : function(config) {
        var me = this;

        me.callParent(arguments);
        me.initConfig(config);

        me.mouseWheelEnabled = false;
        me.submitLocaleSeparator = false;
    },

    // override del metodo generado
    updateObligatorio: function(value) {
        this.allowBlank = !value;
    },
});