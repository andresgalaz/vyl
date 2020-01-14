Ext.define('vyl.view.admin.Loteo', {
    extend: 'Ext.container.Container',
    xtype: 'admin-loteo',
    requires: [
        'vyl.view.admin.LoteoController',
        'vyl.view.admin.LoteoViewModel',

        'vyl.view.admin.LoteoLista',
        'vyl.view.admin.LoteoAbm',
        'vyl.store.Loteo',
    ],
    controller: 'loteo',
    viewModel: { type: 'loteo' },
    layout: { type: 'vbox', align: 'stretch' },
    margin: '10 20 5 20',

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