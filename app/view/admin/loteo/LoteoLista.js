Ext.define('vyl.view.administracion.LoteoLista', {
    extend: 'Ext.grid.Panel',
    xtype: 'loteoLista',
    plugins: 'gridfilters',
    bind: { store: '{stListaLoteoLocal}' },
    width: '100%',
    scrollable: true,
    emptyText: 'No existen loteo ingresados con este filtro',
    viewConfig: { stripeRows: true },
    listeners: { activate: 'onActivateGrillaLista' },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        displayInfo: true,
        bind: '{stListaLoteoLocal}',
        doRefresh: function () { this.fireEvent('refrescar'); },
        listeners: { refrescar: 'onRefrescar' }
    }],
    columns: [{
        text: "Apellido y Nombre",
        dataIndex: 'LOTEO_AYN',
        flex: 2,
        filter: {
            type: 'string',
            itemDefaults: {
                emptyText: 'Buscar por apellido, nombre...'
            }
        }
    }, {
        text: "Cargo",
        dataIndex: 'LOTEO_CARGO',
        flex: 1,
        filter: {
            type: 'list'
        }
    }, {
        xtype: 'checkcolumn',
        text: 'Autorizante',
        dataIndex: 'LOTEO_AUTORIZANTE',
        disabled: true
    }, {
        text: "Estado",
        dataIndex: 'LOTEO_VIGENTE',
        flex: 1,
        filter: {
            type: 'list'
        }
    }, {
        xtype: 'actioncolumn',
        align: 'center',
        width: 50,
        items: [{
            iconCls: 'x-fa fa-file-text-o',
            tooltip: 'Ver detalles',
            handler: 'onCargarRegistro'
        }]
    }]
});