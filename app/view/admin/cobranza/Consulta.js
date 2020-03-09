Ext.define('vyl.view.admin.cobranza.Consulta', {
    extend: 'vyl.ux.container.Main',
    xtype: 'admin-cobranza',
    
    requires: [
        'vyl.view.admin.cobranza.CobranzaViewModel',
        'vyl.view.admin.cobranza.CobranzaController',
        'vyl.view.admin.cobranza.ArchivosWnd'
    ],

    controller: 'cobranza',
    viewModel: {
        type: 'cobranza'
    },

    layout: { 
        type: 'vbox', 
        align: 'stretch' 
    },
    
    scrollable: true,

    items: [
        {
            xtype: 'grid',
            plugins: 'gridfilters',
            bind: {
                store: '{stCobranzaLocal}'
            },
            width: '100%',
            scrollable: true,
            emptyText: 'No existen pagos pendientes',
            viewConfig: {
                stripeRows: true
            },
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    displayInfo: true,
                    bind: '{stCobranzaLocal}'
                },
                // {   
                //     xtype: 'toolbar',
                //     dock: 'bottom',
                //     fixed: true,
                //     ui: 'wkf-tlb-acciones',
                //     margin: '10 0 10 0',
                //     items: [
                //         '->',

                //         {
                //             text: 'Ver archivos procesados',
                //             iconCls: 'x-fa fa-file',
                //             ui: 'wkf-tlb-acciones-toolbar',
                //             handler: 'onArchivoCobranzasVer'
                //         }
                //     ],
                //     height: 36
                // }
            ],
        
            listeners: {
                activate: 'onConsultaActivate',
            },
        
            columns: [
                {
                    text: "Vencimiento",
                    dataIndex: 'VENCIMIENTO',
                    width: 130,
                    formatter: 'date("d/m/Y")',
                },
                {
                    text: "Importe",
                    dataIndex: 'IMPORTE',
                    width: 130
                },
                {
                    text: "Comprador",
                    dataIndex: 'COMPRADOR',
                    flex: 2
                },
                {
                    text: "Loteo",
                    dataIndex: 'LOTEO',
                    flex: 1
                },
                {
                    text: "Parcela",
                    dataIndex: 'PARCELA',
                    width: 130
                },
                {
                    text: "Rol",
                    dataIndex: 'ROL_PROPIEDAD',
                    width: 130
                },
                {
                    xtype: 'actioncolumn',
                    align: 'center',
                    width: 50,
                    items: [
                        {
                            iconCls: 'x-fa fa-file-text-o',
                            tooltip: 'Consultar Formulario',
                            handler: 'onConsultarFormulario'
                        }
                    ]
                }
            ],
            flex: 1
        },
        {
            xtype: 'fieldset',
            title: 'Archivo de Cobranzas',
            collapsible: true,
            margin: '10 0 5 0',
            items: [
                {
                    xtype: 'form',
                    references: 'frmProcesarArchivo',
                    layout: {
                        type: 'hbox', 
                    },
                    margin: '0 0 5 0',
                    fieldDefaults: {
                        labelAlign: 'top',
                        labelWidth: 90,
                        margin: '0 0 5 6'
                    },
                    items: [
                        {
                            xtype: 'filefield',
                            name: 'dataArchivo', //no modificar!!!
                            ui: 'wkf-tlb-acciones-toolbar',
                            fieldLabel: 'Archivo',
                            buttonOnly: false,
                            margin: '10 5 0 5',
                            buttonText: 'Subir',
                            buttonConfig: {
                                iconCls: 'x-fa fa-upload'
                            },
                            listeners: {
                                change: 'onArchivoCobranzasChange'
                            },
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            text: 'Procesar',
                            margin: '31 5 0 5',
                            iconCls: 'x-fa fa-file',
                            handler: 'onArchivoCobranzasProcesar'
                        }
                    ],

                    flex: 1,
                    maxHeight: 100
                }
            ]
        }
    ],


});