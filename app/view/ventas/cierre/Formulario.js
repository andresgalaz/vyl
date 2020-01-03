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

    flujo: 'VENTA_CIERRE',
    etapaActual: 'ingresado',

    // cls: '',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    maxWidth: 1000,
    title: 'Formulario Cierre de Venta',

    listeners: {
        cargadatos: 'onCargarFormulario',  // IMPORTANTE: Se dispara desde el [MainController] onRouteChange, token con parametros
        // activate: 'onActivate'
    },

    initComponent: function () {
        Ext.apply(this, {
            jsonSubmit: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'VYL_ID'
                },
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
                                    name: 'VYL_LOTEO',
                                    flex: 2
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Parcela',
                                    name: 'VYL_PARCELA',
                                    hideTrigger: true,
                                    flex: 1
                                },
                                {
                                    fieldLabel: 'Rol',
                                    name: 'VYL_ROL',
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
                                    name: 'VYL_FECHA_CIERRE',
                                    width: 100
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'VYL_EMPRESA_ID',
                                    fieldLabel: 'Empresa Vendedora',
                                    queryMode: 'local',
                                    displayField: 'EMPRESA_NOMBRE',
                                    valueField: 'EMPRESA_ID',
                                    allowBlank: false,
                                    forceSelection: true,
                                    bind: {
                                        store: '{stEmpresas}'
                                    },
                                    // tpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '{VENDEDOR_AYN} - {EMPRESA}', '</tpl>'),
                                    displayTpl:  Ext.create('Ext.XTemplate', '<tpl for=".">', '{EMPRESA_NOMBRE} ({EMPRESA_RUT}) - Representante: {EMPRESA_REPRESENTANTE} ({EMPRESA_RUT_REPRESENTANTE})', '</tpl>'),
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
                            xtype: 'form',
                            reference: 'frmComprador',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 5 0',
                                    defaultType: 'textfield',
                                    defaults: {
                                        readOnly: true,
                                        allowBlank: false
                                    },
                                    items: [
                                        {
                                            xtype: 'hidden',
                                            name: 'VYL_COMPRADOR_ID'
                                        },
                                        {
                                            xtype: 'rut',
                                            name: 'VYL_COMPRADOR_RUT',
                                            readOnly: false,
                                            listeners: {
                                                blur: 'onClienteBuscar'
                                            },
                                            width: 200
                                        },
                                        {
                                            fieldLabel: 'Apellido y Nombre',
                                            name: 'VYL_COMPRADOR_AYN',
                                            flex: 2
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: 'Nacionalidad',
                                            name: 'VYL_COMPRADOR_NACIONALIDAD',
                                            allowBlank: true,
                                            editable: false,
                                            displayField: 'NACIONALIDAD',
                                            valueField: 'COD',
                                            bind: {
                                                store: '{stNacionalidad}'
                                            },
                                            flex: 1
                                        }
                                    ]
                                },
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
                                            fieldLabel: 'Fono',
                                            name: 'VYL_COMPRADOR_FONO',
                                            hideTrigger: true,
                                            width: 200
                                        },
                                        {
                                            fieldLabel: 'Email',
                                            name: 'VYL_COMPRADOR_EMAIL',
                                            vtype: 'email',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            defaultType: 'textfield',
                                            flex: 1,
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    forId: 'direccion',
                                                    text: 'Direccion:',
                                                    margin: '5 0 5 6'
                                                },
                                                {
                                                    xtype: 'wkfdomiciliofield',
                                                    name: 'VYL_COMPRADOR_DOMICILIO',
                                                    readOnly: true,
                                                    width: '100%',
                                                    margin: '0 0 5 6'
                                                }
                                            ]
                                        }
                                    ]
                                },
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
                                            fieldLabel: 'Profesion',
                                            name: 'VYL_COMPRADOR_PROFESION',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: 'Estado Civil',
                                            name: 'VYL_COMPRADOR_ESTADOCIVIL',
                                            editable: false,
                                            displayField: 'ESTADO',
                                            valueField: 'COD',
                                            bind: {
                                                store: '{stEstadoCivil}'
                                            },
                                            flex: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Modalidad de Contrato Compraventa',
                    collapsible: true,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            items: [
                                {
                                    xtype: 'checkboxgroup',
                                    fieldLabel: 'Modalidad',
                                    columns: 1,
                                    vertical: true,
                                    items: [
                                        { boxLabel: 'Escritura', name: '', reference: 'chEscritura', inputValue: 'escritura' },
                                        { boxLabel: 'Instrucciones', name: '', reference: 'chInstrucciones', inputValue: 'instrucciones' },
                                    ],
                                    flex: 1
                                },
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Observaciones',
                                    name: '',
                                    flex: 1
                                }
                            ]
                        }
                    ],
                },
                {
                    xtype: 'fieldset',
                    title: 'Valores y Forma de Pago',
                    collapsible: true,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaults: {
                                allowBlank: false
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    reference: 'cbModalidadVenta',
                                    fieldLabel: 'Modalidad de Venta',
                                    name: '',
                                    editable: false,
                                    displayField: 'MODALIDAD',
                                    valueField: 'COD',
                                    bind: {
                                        store: '{stModalidadVenta}'
                                    },
                                    listeners: {
                                        select: 'onModalidadVentaSelect'
                                    },
                                    flex: 1
                                },
                                {
                                    xtype: 'numberfield',
                                    reference: 'nfValorPredio',
                                    fieldLabel: 'Valor del Predio',
                                    allowDecimals: false,
                                    minValue: 0,
                                    name: 'VYL_VALOR',
                                    hideTrigger: true,
                                    flex: 1
                                },
                                {
                                    xtype: 'numberfield',
                                    reference: 'nfReserva',
                                    fieldLabel: 'Reserva',
                                    allowDecimals: false,
                                    bind : {
                                        maxValue: '{nfValorPredio.value}'
                                    },
                                    name: 'VYL_RESERVA',
                                    hideTrigger: true,
                                    flex: 1
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Saldo',
                                    readOnly: true,
                                    allowBlank: true,
                                    jsonSubmit: false,
                                    bind: {
                                        value: '{nfValorPredio}'
                                    },
                                    flex: 1
                                },
                                {
                                    xtype: 'combobox',
                                    reference: 'cbModalidadPago',
                                    fieldLabel: 'Modalidad de Pago',
                                    name: '',
                                    editable: false,
                                    displayField: 'MODALIDAD',
                                    valueField: 'COD',
                                    bind: {
                                        store: '{stModalidadPago}'
                                    },
                                    flex: 1
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            reference: 'ctnFinanciamiento',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            hidden: true,
                            items: [
                                {
                                    xtype: 'uxnumberfield',
                                    fieldLabel: 'Pie de Contado',
                                    name: 'VYL_FINANCIAMIENTO_PIE',
                                    hideTrigger: true,
                                    flex: 1
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Monto a Financiar',
                                    readOnly: true,
                                    allowBlank: true,
                                    jsonSubmit: false,
                                    flex: 1
                                },
                                {
                                    xtype: 'uxnumberfield',
                                    fieldLabel: 'Cuotas',
                                    name: 'VYL_FINANCIAMIENTO_CUOTAS',
                                    minValue: 1,
                                    width: 100
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Valor Cuota',
                                    allowBlank: true,
                                    readOnly: true,
                                    flex: 1
                                },
                                {
                                    xtype: 'uxdatefield',
                                    format: "d/m/Y",
                                    fieldLabel: 'Vto. 1er Cuota',
                                    name: 'VYL_FINANCIAMIENTO_VTO',
                                    width: 150
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Gastos de Operación',
                    collapsible: true,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'numberfield',
                            defaults: {
                                allowBlank: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                flex: 1
                            },
                            bind: {
                                hidden: '{!chLeasing.checked}'
                            },
                            items: [
                                {
                                    fieldLabel: 'Contrato Leasing',
                                    name: 'VYL_CONTRATO_LEASING'
                                },
                                {
                                    fieldLabel: 'Gasto Notarial',
                                    name: 'VYL_CONTRATO_LEASING_NOTARIO'
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'numberfield',
                            defaults: {
                                allowBlank: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                flex: 1
                            },
                            bind: {
                                hidden: '{!chEscritura.checked}'
                            },
                            items: [
                                {
                                    fieldLabel: 'Escritura',
                                    name: 'VYL_ESCRITURA'
                                },
                                {
                                    fieldLabel: 'Gasto Notarial',
                                    name: 'VYL_ESCRITURA_NOTARIO'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'numberfield',
                            defaults: {
                                allowBlank: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                flex: 1
                            },
                            items: [
                                {
                                    fieldLabel: 'Gasto Notarial Instrucciones',
                                    bind: {
                                        hidden: '{!chInstrucciones.checked}'
                                    },
                                    name: 'VYL_INSTRUCCIONES_NOTARIO'
                                },
                                {
                                    
                                    fieldLabel: 'CBR (Estimado)',
                                    name: 'VYL_CBR'
                                },
                            ]
                        },
                    ]
                }
                
            ],
        });

        this.callParent(arguments);
    }   
});