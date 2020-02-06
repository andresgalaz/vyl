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
    
    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl : new Ext.XTemplate(
                '<p><b>Rol:</b> {}</p>',
                '<p><b>Modalidad de Venta:</b> {}</p>',
                '<p><b>Cuotas Pagadas:</b> {} - <b>Adeudadas:</b> {}</p>',
                '<p><b>Ultimo Pago:</b> {}</p>'
            )
        },
        {
            ptype: 'gridfilters',
        }
    ],

    bind: {
        store: '{stFormulariosIngresadosLocal}'
    },

    width: '100%',
    scrollable: true,
    margin: '10 20 10 20',

    cls: 'consulta-venta',
    
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
        rowdblclick: 'onConsultaRowDblClick',
    },

    columns: [
        {
            // text: 'Atraso',
            dataIndex: '',
            width: 30, // Mantener fijo
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.tdCls = 'icono-urgente';
                } 
                // if (value >= 0 && value < 20) {
                //     metaData.tdCls = 'icono-baja';
                // } else if (value >= 20 && value < 40) {
                //     metaData.tdCls = 'icono-media';
                // } else if (value >= 40 && value < 60) {
                //     metaData.tdCls = 'icono-alta';
                // } else if (value > 60) {
                //     metaData.tdCls = 'icono-urgente';
                // }

                return;
            }
        },
        {
            text: "Fecha Vta.",
            dataIndex: 'FECHA_VENTA',
            width: 130,
            formatter: 'date("d/m/Y")',
            filter: {
                type: 'date',
                fields: {
                    lt: {
                        text: 'Antes de...'
                    },
                    gt: {
                        text: 'Despues de...'
                    },
                    eq: {
                        text: 'Fecha Exacta'
                    }
                }
            }
        },
        {
            text: "Loteo",
            dataIndex: 'LOTEO',
            flex: 1,
            filter: {
                type: 'list',
            }
        },
        {
            text: "Parcela",
            dataIndex: 'PARCELA',
            width: 130
        },
        {
            text: "Comprador",
            dataIndex: 'COMPRADOR_NOMBRE',
            flex: 2,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Ingrese Nombre y Apellido...'
                }
            }
        },
        {
            text: "Monto",
            dataIndex: '',
            width: 200
        },
        {
            text: "Pie",
            dataIndex: '',
            width: 200
        },
        {
            text: "Saldo",
            dataIndex: '',
            width: 200
        },
        {
            text: "Estado",
            dataIndex: 'WKF_ETAPA',
            width: 130,
            filter: {
                type: 'list',
            }
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
