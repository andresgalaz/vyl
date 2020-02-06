Ext.define('vyl.view.ventas.cierre.Consulta', {
    extend: 'Ext.grid.Panel',
    xtype: 'ventas-cierre-consulta',
    
    requires: [
        'vyl.view.ventas.cierre.VentasCierreViewModel',
        'vyl.view.ventas.cierre.VentasCierreController'
    ],

    controller: 'ventasciere',
    viewModel: {
        type: 'ventasciere'
    },
    
    plugins: 'gridfilters',

    bind: {
        store: '{stFormulariosIngresadosLocal}'
    },

    width: '100%',
    scrollable: true,
    margin: '10 20 10 20',
    
    emptyText: 'No existen formularios ingresados con este filtro',
    viewConfig: {
        stripeRows: true
    },

    dockedItems: [
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            bind: '{stFormulariosIngresadosLocal}'
        }
    ],

    listeners: {
        activate: 'onConsultaActivate',
        rowdblclick: 'onConsultaRowDblClick'
    },

    columns: [
        {
            text: "Fecha Vta.",
            dataIndex: 'FECHA_VENTA',
            width: 130,
            formatter: 'date("d/m/Y")',
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
            text: "Comprador",
            dataIndex: 'COMPRADOR_NOMBRE',
            flex: 2
        },
        {
            text: "Estado",
            dataIndex: 'WKF_ETAPA',
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
