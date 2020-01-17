Ext.define('vyl.ux.grid.SubmitData', {
    // Realiza submit de toda la  grilla, el model de la grilla tiene que tener el campo submitValue
    extend: 'Ext.grid.Panel',
    alias: 'widget.wkfGridSubmit',
    xtype: 'wkfgridsubmit',
    
    config: {
        allowBlank: true,
    },

    submitValue: true,
    
    listeners: {
        focusleave: {
            fn: function(fld, evt, opts) {
                this.validate();
            }
        }
    },

    constructor : function(config) {
        var me = this;
        
        me.callParent(arguments);
        me.initConfig(config);

        me.isFormField = true;
    },

    initConfig: function() {
        var me = this;

        Ext.apply(this, {
            columnLines: true,
        });
        
        me.callParent(arguments);
    },

    getName: function() {
        return this.name;
    },


    getSubmitData: function() {
        var me = this,
            store = me.getStore(),
            data = {},
            values = [],
            valueItem = {},
            fields = [];

        // Toma los campos que se envian los datos
        store.getModel().fields.forEach(function(field, index) {
            if (index >= 0 && field.submitValue) {
                fields.push(field);
            }
        });

        // Crea el array
        store.getData().items.forEach(function(row, index){
            valueItem = {};
            for (var d in row.data) {
                fields.forEach(function(fld){
                    if (fld.name == d) {
                        if (fld.type == 'date') {
                            valueItem[d] = Ext.Date.format(row.data[d], fld.dateFormat);
                        } else {
                            valueItem[d] = row.data[d];
                        }
                    }
                });
            }  //Recorrio todo el registro
            values.push(valueItem);
            valueItem = {};
        });
        
        data[me.getName()] = values ? values : null;

        return data;
    },

    isValid: function() {
        return this.validate();
    },

    validate: function() {
        var me = this,
            valid = true,
            store = me.getStore();

        if (!me.getAllowBlank()) {
            valid = store.getCount() > 0 ? true : false;
        }

        return valid;
    },

    isDirty: function() {
        return false;
    },

    reset: function() {
        var me = this;

        me.getStore().removeAll();
    },

    setReadOnly: function(readOnly) {
        var me = this,
            selModel = me.getSelectionModel();
      
        selModel.setLocked(readOnly);
    }
});