Ext.define('vyl.ux.form.Datefield', {
    // La unica diferencia es que permite bind de allowblank
    extend: 'Ext.form.field.Date',
    alias: 'widget.wkfDatefield',
    xtype: 'wkfdatefield',
    
    config: {
        obligatorio: false
    },
    
    constructor : function(config) {
        var me = this,
            boxes;

        me.callParent(arguments);
        me.initConfig(config);
    },

    // override del metodo generado
    updateObligatorio: function(value) {
        this.allowBlank = !value;
    }
});