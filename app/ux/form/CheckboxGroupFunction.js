Ext.define('vyl.ux.form.CheckboxGroupFunction', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.wkfCheckboxGroupFunction',
    xtype: 'wkfcheckboxgroupfn',

    // fnCargaItems: '',
    params: {},
    
    config: {
        obligatorio: false
    },

    constructor : function(config) {
        // Carga los items del checkbox a partir de una funcion en la BD
        var me = this,
            fnDB,
            nombre,
            arrItems = [],
            checkboxes;

        me.callParent(arguments);
        me.initConfig(config);

        nombre = me.name;

        if (me.params.prm_funcion) {
            Ext.Ajax.request({
                url: GLOBAL_HOST+'/do/jsonCall',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
    
                params: me.params,
           
                success: function(response, opts) {
                    var checkboxes = JSON.parse(response.responseText);

                    checkboxes.records.forEach( function(rd) {
                       arrItems.push(
                           Ext.create({
                               xtype: 'checkbox',
                               boxLabel: rd.ETIQUETA,
                               name: nombre,
                               inputValue: rd.INPUTVAL
                           })
                       );
                    });

                    if (arrItems) {
                        me.add(arrItems);
                    }
                },
                failure: function(response, opts) {
                    console.error('Error en carga wkfRadioGroup: ' + response.status);
                }
            });
        }
    },

    // Codigo extjs original -> Modificado para leer datos de xml
    setValue: function(value) {
        var me    = this,
            boxes = me.getBoxes(),
            b,
            bLen  = boxes.length,
            box, name,
            cbValue;
 
        me.batchChanges(function() {
            Ext.suspendLayouts();
            for (b = 0; b < bLen; b++) {
                box = boxes[b];
                name = box.getName();
                cbValue = false;

                if (value) {
                    if (Ext.isArray(value)) {
                        cbValue = Ext.Array.contains(value, box.inputValue);
                    } else {
                        // Un solo valor
                        cbValue = box.inputValue == value;
                    }
                }
 
                box.setValue(cbValue);
            }
            Ext.resumeLayouts(true);
        });
        return me;
    },
    
    updateObligatorio: function(value){
        this.allowBlank = !value;
    },
});
