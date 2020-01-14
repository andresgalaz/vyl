Ext.define('vyl.view.administracion.LoteoAbm', {
    extend: 'Ext.form.Panel',
    xtype: 'abmloteo',
    // url: '../do/jsonCall',
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
        }, {
            text: 'Desactivar',
            reference: 'btnBaja',
            hidden: true,
            iconCls: 'x-fa fa-arrow-circle-down',
            ui: 'wkf-btn-no-ok',
            name: 'desactivar',
            handler: 'onAccionAbm'
        }, {
            text: 'Activar',
            reference: 'btnActivar',
            hidden: true,
            iconCls: 'x-fa fa-arrow-circle-up',
            ui: 'wkf-btn-ok',
            name: 'activar',
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
                name: 'LOTEO_PLOTEO',
                value: 0
            }, {
                xtype: 'hidden',
                name: 'LOTEO_CPASSWORD'
            }, {
                xtype: 'fieldset',
                name: 'datosPersonales',
                title: 'Datos Principales',
                layout: { type: 'vbox', align: 'stretch' },
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel: 'Nombre y Apellido',
                        name: 'LOTEO_CNOMBRE',
                        allowBlank: false,
                        maxLength: 80,
                        flex: 2
                    }, {
                        fieldLabel: 'Loteo',
                        name: 'LOTEO_CLOTEO',
                        maxLength: 20,
                        flex: 1
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel: 'Email',
                        name: 'LOTEO_CEMAIL',
                        vtype: 'email',
                        allowBlank: false,
                        maxLength: 80,
                        flex: 2
                    }, {
                        xtype: 'combobox',
                        name: 'LOTEO_FGRUPO',
                        fieldLabel: 'Cargo',
                        displayField: 'DESCRIPCION',
                        valueField: 'COD',
                        editable: false,
                        allowBlank: false,
                        bind: { store: '{stCargos}' },
                        flex: 1
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: 'Accesos',
                layout: { type: 'vbox', align: 'stretch' },
                items: [{
                    xtype: 'tagfield',
                    fieldLabel: 'Perfiles',
                    name: 'LOTEO_ACCESOS',
                    bind: { store: '{stPerfiles}' },
                    emptyText: 'Seleccione al menos un perfil...',
                    displayField: 'DESCRIPCION',
                    valueField: 'COD',
                    filterPickList: true,
                    queryMode: 'local',
                    publishes: 'value',
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    defaultType: 'textfield',
                    items: [{
                        xtype: 'checkbox',
                        reference: 'chCambioPassword',
                        boxLabel: '<b>Solicitar cambio password</b>',
                        name: 'LOTEO_BPASSWORDCADUCA',
                        inputValue: '1',
                        margin: '25 0 0 0',
                        width: 200
                    }, {
                        fieldLabel: 'Password Reinicio',
                        reference: 'txPasswordReinicio',
                        submitValue: false,
                        bind: { visible: '{chCambioPassword.checked}' },
                        flex: 1
                    }]
                }]
            }]
        });

        this.callParent(arguments);
    }
});
