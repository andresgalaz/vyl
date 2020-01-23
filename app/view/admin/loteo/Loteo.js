Ext.define('vyl.view.admin.loteo.Loteo', {
    extend: 'Ext.container.Container',
    xtype: 'admin-loteo',
    requires: [
        'vyl.view.admin.loteo.LoteoController',
        'vyl.view.admin.loteo.LoteoViewModel',

        'vyl.view.admin.loteo.LoteoLista',
        'vyl.view.admin.loteo.LoteoAbm'
    ],
    controller: 'loteo',
    viewModel: { type: 'loteo' },
    layout: { type: 'vbox', align: 'stretch' },
    margin: '10 20 5 20',
    
    listeners: {
        cargadatos: 'onLoteoCargar',  // IMPORTANTE: Se dispara desde el [MainController] onRouteChange, token con parametros
    },

    items: [{
        xtype: 'tabpanel',
        reference: 'tabPrincipal',
        activeTab: 0,
        items: [{
            xtype: 'loteoLista',
            reference: 'gpLista',
            title: 'Lista Loteos',
            name: 'listado',
            routeId: 'listado',
            iconCls: 'x-fa fa-list',
            listeners: { activate: 'onActivateGrillaLista', }
        }, {
            xtype: 'abmloteo',
            reference: 'frmAbmLoteo',
            title: 'Formulario Ingreso Loteo',
            routeId: 'frmingreso',
            iconCls: 'x-fa fa-file-text-o',
            maxWidth: 1000,
            listeners: { activate: 'onActivateAbmLoteo' }
        }],
        flex: 1
    }]
});