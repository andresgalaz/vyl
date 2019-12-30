Ext.define('vyl.ux.form.RadioGroupFunction', {
    extend: 'Ext.form.RadioGroup',
    alias: 'widget.wkfRadioGroupFunction',
    xtype: 'wkfradiogroupfn',

    fnCargaItems: '',

    config: {
        obligatorio: false
    },

    constructor : function(config) {
        // Carga los items del radio a partir de una funcion en la BD
        var me = this,
            fnDB ,
            arrItems = [],
            radio;

        me.callParent(arguments);
        me.initConfig(config);

        fnBD = me.fnCargaItems;

        if (fnBD) {
            Ext.Ajax.request({
                url: '../do/jsonCall',
    
                params: {
                    prm_funcion : fnBD
                },
           
                success: function(response, opts) {
                    var radios = JSON.parse(response.responseText);

                    radios.records.forEach( function(rd) {
                       arrItems.push(
                           Ext.create({
                               xtype: 'radio',
                               boxLabel: rd.ETIQUETA,
                               name: rd.NOMBRE,
                               inputValue: rd.ID
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

    updateObligatorio: function(value){
        this.allowBlank = !value;
    }
});