Ext.define('vyl.view.admin.loteo.LoteoAbm', {
    extend: 'Ext.form.Panel',
    xtype: 'abmloteo',
    frame: false,
    scrollable: true,
    bodyPadding: 15,
    fieldDefaults: { labelAlign: 'top', labelWidth: 90, margin: '0 0 5 6' },

    title: 'Lista Loteo',
    bbar: {
        reference: 'tlbAcciones',
        ui: 'wkf-tlb-acciones',  //Proviene de theme-pe
        fixed: true,
        margin: '10 0 10 0',
        items: [{
            text: 'Salir',
            iconCls: 'x-fa fa-sign-out',
            ui: 'wkf-tlb-acciones-toolbar',
            name: 'salir',
            handler: 'onAccionAbm'
        }, '-', {
            text: 'Nuevo',
            iconCls: 'x-fa fa-file',
            ui: 'wkf-tlb-acciones-toolbar',
            name: 'nuevo',
            handler: 'onAccionAbm'
        }, '->', {
            text: 'Grabar',
            reference: 'btnGrabar',
            iconCls: 'x-fa fa-save',
            ui: 'wkf-btn-ok',
            name: 'grabar',
            handler: 'onAccionAbm'
        }]
    },

    listeners: { activate: 'onActivateAbmLoteo' },

    initComponent: function () {
        Ext.apply(this, {
            jsonSubmit: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                defaultType: 'textfield',
                layout: 'anchor',
                collapsible: true,
                margin: 10,
            },
            items: [{
                xtype: 'hidden',
                reference: 'idRegistro',
                name: 'LOTEO_ID',
                value: 0
            }, {
                xtype: 'fieldset',
                name: 'datosPpal',
                title: 'Datos Principales',
                layout: { type: 'vbox', align: 'stretch' },
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel: 'Nombre',
                        name: 'LOTEO_NOMBRE',
                        allowBlank: false,
                        maxLength: 20,
                        flex: 1
                    }, {
                        fieldLabel: 'Descripción',
                        name: 'LOTEO_DESCRIPCION',
                        maxLength: 120,
                        flex: 4
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel: 'Deslinde Escritura',
                        xtype: 'textarea',
                        name: 'LOTEO_DESLINDE',
                        allowBlank: true,
                        anchor: '100%',
                        grow: true,
                        flex: 4
                    }]
                }]
            }]
        });

        this.callParent(arguments);
    }
});
