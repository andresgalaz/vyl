Ext.define('vyl.view.admin.cobranza.Consulta', {
    extend: 'Ext.grid.Panel',
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
    
    plugins: 'gridfilters',

    bind: {
        store: '{stCobranzaLocal}'
    },

    width: '100%',
    scrollable: true,
    margin: '10 20 10 20',
    
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
        {   
            xtype: 'toolbar',
            dock: 'bottom',
            fixed: true,
            ui: 'wkf-tlb-acciones',
            margin: '10 0 10 0',
            items: [
                '->',
                {
                    xtype: 'filefield',
                    name: 'dataArchivo', //no modificar!!!
                    ui: 'wkf-tlb-acciones-toolbar',
                    buttonOnly: true,
                    margin: '0 5 0 0',
                    buttonText: 'Procesar nuevo archivo de pagos',
                    buttonConfig: {
                        iconCls: 'x-fa fa-upload'
                    },
                    listeners: {
                        change: 'onArchivoPagosChange'
                    }
                },
                {
                    text: 'Ver archivos procesados',
                    iconCls: 'x-fa fa-file',
                    ui: 'wkf-tlb-acciones-toolbar',
                    handler: 'onArchivoPagosVer'
                }
            ],
            height: 36
        }
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
    ]
});