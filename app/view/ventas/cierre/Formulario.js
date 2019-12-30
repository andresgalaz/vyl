Ext.define('vyl.view.ventas.cierre.Formulario', {
    extend: 'vyl.ux.form.WkfPanel',
    xtype: 'ventas-cierre',
    
    requires: [
        'vyl.view.ventas.cierre.FormularioViewModel',
        'vyl.view.ventas.cierre.FormularioController'
    ],

    controller: 'ventasciere',
    viewModel: {
        type: 'ventasciere'
    },

    scrollable: 'y',
    margin: '10 20 10 20',
    title: '',

    flujo: '',
    etapaActual: '',

    // cls: '',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // listeners: {
    //     cargadatos: 'onCargarFormulario',  // IMPORTANTE: Se dispara desde el [MainController] onRouteChange, token con parametros
    //     activate: 'onActivate'
    // },

    initComponent: function () {
        Ext.apply(this, {
            jsonSubmit: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Datos de Venta',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'textfield',
                            defaults: {
                                allowBlank: false,
                            },
                            items: [
                                {
                                    fieldLabel: 'Loteo',
                                    name: '',
                                    flex: 2
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Parcela',
                                    name: '',
                                    hideTrigger: true,
                                    flex: 1
                                },
                                {
                                    fieldLabel: 'Rol',
                                    name: '',
                                    flex: 1
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'textfield',
                            defaults: {
                                allowBlank: false,
                            },
                            items: [
                                {
                                    xtype: 'datefield',
                                    format: "d/m/Y",
                                    fieldLabel: 'Fecha Venta',
                                    name: '',
                                    width: 100
                                },
                                {
                                    xtype: 'combobox',
                                    name: '',
                                    fieldLabel: 'Vendedor',
                                    queryMode: 'local',
                                    displayField: '',
                                    valueField: '',
                                    allowBlank: false,
                                    bind: {
                                        store: '{stVendedores}'
                                    },
                                    // displayTpl:  Ext.create('Ext.XTemplate', '<tpl for=".">', '{TRATAMIENTO} - {DESCRIPCION} ({INTENCION})', '</tpl>'),
                                    flex: 1
                                },
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Datos Comprador',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'textfield',
                            defaults: {
                                readOnly: true
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'RUT',
                                    name: '',
                                    readOnly: false,
                                    hideTrigger: true,
                                    listeners: {

                                    },
                                    width: 200
                                },
                                {
                                    fieldLabel: 'Apellido',
                                    name: '',
                                    flex: 1
                                },
                                {
                                    fieldLabel: 'Nombre',
                                    name: '',
                                    flex: 1
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Nacionalidad',
                                    name: '',
                                    editable: false,
                                    displayField: 'NACIONALIDAD',
                                    valueField: 'COD',
                                    bind: {
                                        store: '{stNacionalidad}'
                                    },
                                }
                            ]
                        }
                    ]
                }
            ],
        });

        this.callParent(arguments);
    }   
});