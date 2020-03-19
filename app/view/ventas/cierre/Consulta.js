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
            rowBodyTpl: [
                '<tpl>',
                    '<p><b>Modalidad de Venta:</b> {MODALIDAD_VENTA}</p>',
                    '<tpl if="ROL_PROPIEDAD"><p><b>Rol:</b> {ROL_PROPIEDAD}</p></tpl>',
                    '<tpl if="CUOTAS_PAGADAS === Financiado">',
                        '<p><b>Cuotas Pagadas:</b> {CUOTAS_PAGADAS} - <b>Atrasadas:</b> {CUOTAS_ATRASADAS}</p>',
                        '<p><b>Ultimo Pago:</b> {FECHA_ULTIMO_PAGO}</p>',
                    '</tpl>',
                '</tpl>'
            ]
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
            dataIndex: 'LEASING_ATRASADO',
            width: 38, // Mantener fijo
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
            width: 100,
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
            width: 70
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
            dataIndex: 'VALOR_PREDIO',
            xtype: 'numbercolumn',
            format: '999,999,999',
            align: 'right',
            width: 90
        },
        {
            text: "Pie",
            dataIndex: 'PIE_INICIAL',
            xtype: 'numbercolumn',
            format: '999,999,999',
            align: 'right',
            width: 90
        },
        {
            text: "Reserva",
            dataIndex: 'MONTO_RESERVA',
            xtype: 'numbercolumn',
            format: '999,999,999',
            align: 'right',
            width: 90
        },
        {
            text: "Estado",
            dataIndex: 'WKF_ETAPA',
            width: 300,
            filter: {
                type: 'list',
            }
        },
        {
            xtype: 'actioncolumn',
            align: 'center',
            width: 40,
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
