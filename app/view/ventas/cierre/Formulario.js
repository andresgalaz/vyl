Ext.define('vyl.view.ventas.cierre.Formulario', {
    extend: 'vyl.ux.form.WkfPanel',
    xtype: 'ventas-cierre',
    
    requires: [
        'vyl.view.ventas.cierre.VentasCierreViewModel',
        'vyl.view.ventas.cierre.VentasCierreController'
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

    cls: 'formulario-venta',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    maxWidth: 1000,
    title: 'Formulario Cierre de Venta - Nuevo',

    listeners: {
        cargadatos: 'onFormularioCargar',  // IMPORTANTE: Se dispara desde el [MainController] onRouteChange, token con parametros
        activate: 'onFormularioActivate'
    },

    initComponent: function () {
        Ext.apply(this, {
            submitValue: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'VYL_ID',
                    bind: {
                        value: '{formularioId}'
                    }
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
                                    xtype: 'combobox',
                                    name: 'VYL_LOTEO',
                                    fieldLabel: 'Loteo',
                                    queryMode: 'local',
                                    displayField: 'LOTEO_NOMBRE',
                                    valueField: 'LOTEO_ID',
                                    allowBlank: false,
                                    forceSelection: true,
                                    bind: {
                                        store: '{stLoteo}'
                                    },
                                    flex: 2
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'x-fa fa-plus-circle',
                                    text: 'Nuevo Loteo',
                                    margin: '26 0 5 5',
                                    handler: 'onLoteoNuevo'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Parcela',
                                    name: 'VYL_PARCELA',
                                    hideTrigger: true,
                                    submitLocaleSeparator: false,
                                    allowDecimals: false,
                                    decimalPrecision: 0,
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
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            items: [
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Observaciones',
                                    name: 'VYL_VENTAS_OBSERVACIONES',
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            items: [
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Deslinde Loteo',
                                    name: 'VYL_LOTEO_DESLINDE',
                                    flex: 1
                                }
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
                                            obligatorio: true,
                                            listeners: {
                                                blur: 'onClienteBuscar'
                                            },
                                            width: 200
                                        },
                                        {
                                            fieldLabel: 'Nombre y Apellido',
                                            reference: 'txfCompradorAyN',
                                            name: 'VYL_COMPRADOR_NOMBRE',
                                            flex: 2
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: 'Sexo',
                                            name: 'VYL_COMPRADOR_SEXO',
                                            editable: false,
                                            displayField: 'SEXO',
                                            valueField: 'COD',
                                            bind: {
                                                store: '{stSexo}'
                                            },
                                            width: 200
                                        },
                                        {
                                            xtype: 'combobox',
                                            reference: 'cbNacionalidad',
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
                                            // xtype: 'numberfield',
                                            xtype: 'textfield',
                                            allowThousandSeparator: false,
                                            fieldLabel: 'Fono',
                                            name: 'VYL_COMPRADOR_TELEFONO',
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
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'VYL_COMPRADOR_DOMICILIO_PISO',
                                            fieldLabel: 'Piso',
                                            allowDecimals: false,
                                            decimalPrecision: 0,
                                            minValue: 0,
                                            width: 80
                                        },
                                        {
                                            name: 'VYL_COMPRADOR_DOMICILIO_DTO',
                                            fieldLabel: 'Dpto.',
                                            width: 80
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
                                            name: 'VYL_COMPRADOR_ESTADO_CIVIL',
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
                                    fieldLabel: 'Contrato',
                                    columns: 1,
                                    vertical: true,
                                    items: [
                                        { boxLabel: 'Escritura', name: 'VYL_CONTRATO', reference: 'chEscritura', inputValue: 'escritura' },
                                        { boxLabel: 'Instrucciones', name: 'VYL_CONTRATO', reference: 'chInstrucciones', inputValue: 'instrucciones' },
                                    ],
                                    flex: 1
                                },
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Observaciones',
                                    name: 'VYL_MODALIDAD_OBSERVACIONES',
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
                            defaultType: 'uxnumberfield',
                            defaults: {
                                allowBlank: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                decimalPrecision: 0,
                                minValue: 0,
                                flex: 1
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    reference: 'cbModalidadVenta',
                                    fieldLabel: 'Modalidad de Venta',
                                    name: 'VYL_MODALIDAD_VENTA',
                                    hideTrigger: false,
                                    editable: false,
                                    displayField: 'MODALIDAD',
                                    valueField: 'COD',
                                    bind: {
                                        store: '{stModalidadVenta}'
                                    },
                                    listeners: {
                                        select: 'onModalidadVentaSelect'
                                    }
                                },
                                {
                                    reference: 'nfValorPredio',
                                    fieldLabel: 'Valor del Predio',
                                    name: 'VYL_VALOR',
                                    obligatorio: true,
                                    listeners: {
                                        blur: 'onValorPredioBlur'
                                    }
                                },
                                {
                                    reference: 'nfReserva',
                                    fieldLabel: 'Reserva',
                                    name: 'VYL_RESERVA',
                                    obligatorio: true,
                                    listeners: {
                                        blur: 'onValorReservaBlur'
                                    }
                                },
                                {
                                    fieldLabel: 'Saldo',
                                    readOnly: true,
                                    submitValue: false,
                                    bind: {
                                        value: '{getSaldo}'
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    reference: 'cbModalidadPago',
                                    fieldLabel: 'Modalidad de Pago',
                                    name: 'VYL_MODALIDAD_PAGO',
                                    hideTrigger: false,
                                    allowBlank: false,
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
                            defaultType: 'uxnumberfield',
                            defaults: {
                                allowBlank: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                decimalPrecision: 0,
                                minValue: 0,
                                flex: 1
                            },
                            items: [
                                {
                                    fieldLabel: 'Pie de Contado',
                                    name: 'VYL_FINANCIAMIENTO_PIE',
                                    listeners: {
                                        blur: 'onValorContadoBlur'
                                    }
                                },
                                {
                                    fieldLabel: 'Monto a Financiar',
                                    readOnly: true,
                                    submitValue: false,
                                    bind: {
                                        value: '{getFinanciamiento}'
                                    }
                                },
                                {
                                    fieldLabel: 'Cuotas',
                                    name: 'VYL_FINANCIAMIENTO_CUOTAS',
                                    minValue: 1,
                                    hideTrigger: false,
                                    listeners: {
                                        change: 'onCuotasChange'
                                    },
                                    width: 100
                                },
                                {
                                    fieldLabel: '% Interés Anual',
                                    name: 'VYL_FINANCIAMIENTO_INTERESES',
                                    allowDecimals: true,
                                    decimalPrecision: 2,
                                    listeners: {
                                        change: 'onInteresChange'
                                    },
                                    value: 0,
                                    width: 100
                                },
                                {
                                    fieldLabel: 'Valor Cuota',
                                    name: 'VYL_VALOR_CUOTA',
                                    readOnly: true,
                                    bind: {
                                        value: '{getValorCuota}'
                                    }
                                },
                                {
                                    xtype: 'uxdatefield',
                                    format: "d/m/Y",
                                    fieldLabel: 'Vto. 1er Cuota',
                                    name: 'VYL_FINANCIAMIENTO_VTO',
                                    hideTrigger: false,
                                    width: 150
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            items: [
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Importante',
                                    name: 'VYL_FORMA_PAGO_OBSERVACIONES',
                                    flex: 1
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
                            reference: 'ctnFinanciamientoGastos',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            hidden: true,
                            defaultType: 'uxnumberfield',
                            defaults: {
                                allowBlank: true,
                                mouseWheelEnabled: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                decimalPrecision: 0,
                                minValue: 0,
                                flex: 1
                            },
                            items: [
                                {
                                    fieldLabel: 'Contrato Leasing',
                                    name: 'VYL_FINANCIAMIENTO_GASTO_CONTRATO'
                                },
                                {
                                    fieldLabel: 'Gasto Notarial',
                                    name: 'VYL_FINANCIAMIENTO_GASTO_NOTARIAL'
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            defaultType: 'uxnumberfield',
                            defaults: {
                                allowBlank: true,
                                mouseWheelEnabled: false,
                                hideTrigger: true,
                                allowDecimals: false,
                                decimalPrecision: 0,
                                minValue: 0,
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
                            defaultType: 'uxnumberfield',
                            defaults: {
                                allowBlank: true,
                                hideTrigger: true,
                                allowDecimals: false,
                                decimalPrecision: 0,
                                minValue: 0,
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
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            items: [
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Observaciones',
                                    name: 'VYL_GASTOS_OBSERVACIONES',
                                    flex: 1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Archivos Disponibles',
                    reference: 'flsArchivos',
                    collapsible: true,
                    items: [
                        {
                            xtype: 'dataview',
                            cls: 'archivos-dataview',
                            emptyText: 'No hay archivos disponibles',
                            bind: {
                                store: '{stArchivos}',
                                data: {
                                    pVenta: '{formularioId}'
                                }
                            },
                            itemSelector: 'div.thumb-wrap',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                    '<div class="thumb-wrap">',
                                        '<a class="thumb" href="{[this.getUrl(values.BSH)]}" download="{[this.getNombre(values.TITULO)]}">',
                                            '<div class="thumb-icon"></div>',
                                            '<div class="thumb-title-container">',
                                                '<div class="thumb-title">{TITULO}</div>',
                                            '</div>',
                                            '<div class="thumb-download"></div>',
                                        '</a>',
                                    '</div>',
                                '</tpl>', 
                                {
                                    getUrl: function(url) {
                                        var data = this.owner.getData();

                                        return data.pVenta > 0 ? GLOBAL_HOST+'/do/' + url + '?prm_dataSource=vylDS&prm_pVenta=' + data.pVenta : null;
                                    },

                                    getNombre: function(archivoTp) {
                                        return archivoTp;
                                    }
                                }
                            ),
                            flex: 1
                        }
                    ]
                }
            ]
        });

        this.callParent(arguments);
    }   
});
