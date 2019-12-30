Ext.define('vyl.ux.form.Textfield', {
    // La unica diferencia es que permite bind de allowblank
    extend: 'Ext.form.field.Text',
    alias: 'widget.wkfTextfield',
    xtype: 'wkftextfield',
    
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