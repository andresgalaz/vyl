Ext.define('vyl.ux.form.Combobox', {
    // La unica diferencia es que permite bind de allowblank
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.wkfCombobox',
    xtype: 'wkfcombobox',
    
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