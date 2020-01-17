Ext.define('vyl.ux.grid.SelectPanel', {
    // Tiene la particularidad que hace submit de la seleccion en la grilla, envia un array de dicha seleccion
    // IMPORTANTE: En su store debe haber siempre un campo ID
    extend: 'Ext.grid.Panel',
    alias: 'widget.wkfGridSelect',
    xtype: 'wkfgridselect',
    
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
            selModel: {
                selType: 'checkboxmodel'  //Ext.selection.CheckboxModel
            },
            // columnLines: true,
        });
        
        me.callParent(arguments);
    },

    getName: function() {
        return this.name;
    },

    getSelection: function() {
        return this.getSelectionModel().getSelected().items;
    },

    getSubmitData: function() {
        var me = this,
            selection = me.getSelection(),
            data = {},
            value = [];
        
        selection.forEach(function(row, index){
            // value.push(row.data.ID);  //MVICO 20180704: Envia todo el registro
            value.push(row.data);
        });
        
        data[me.getName()] = value ? value : null;

        return data;
    },

    isValid: function() {
        return this.validate();
    },

    validate: function() {
        var me = this,
            valid = true;

        if (!me.getAllowBlank()) {
            valid = me.getSelection().length > 0 ? true : false;
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

    resetSelection: function() {
        var me = this,
            selModel = me.getSelectionModel();
        
        selModel.deselectAll();
    },

    setReadOnly: function(readOnly) {
        var me = this,
            selModel = me.getSelectionModel();
      
        selModel.setLocked(readOnly);
    },

    setValue: function(val) {
        var me = this,
            st = me.getStore(),
            id,
            arrSelection = [],
            selModel = me.getSelectionModel(),
            locked = selModel.isLocked();

        st.data.items.forEach(function(row, index){
            id = '' + row.data.ID + '';

            // MVICO Originalmente se enviaba solo el data.ID, luego todo el objeto data
            // Se arma esto para que convivan ambas versiones
            if (Ext.isArray(val)) {
                val.forEach(function(reg, index){
                    if (reg.ID == id || reg == id) {
                        arrSelection.push(row);
                    }
                });
            } else if (Ext.isObject(val)) {
                if (val.ID == id) {
                    arrSelection.push(row);
                }
            }
        });
        
        selModel.setLocked(false);  // Desbloquea para poder seleccionar

        if (arrSelection.length > 0) {
            selModel.select(arrSelection);
        }
       
        selModel.setLocked(locked);  //Vuelve al estado original
    }
});