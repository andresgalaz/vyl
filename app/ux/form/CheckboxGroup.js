Ext.define('vyl.ux.form.CheckboxGroup', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.wkfCheckboxGroup',
    xtype: 'wkfcheckboxgroup',

    config: {
        obligatorio: false
    },
    
    constructor : function(config) {
        var me = this,
            boxes;

        me.callParent(arguments);
        me.initConfig(config);

        // Setea el name para que funcione el setValue
        boxes =  me.getBoxes();
        if (boxes) {
            me.name =  boxes[0].getName();
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