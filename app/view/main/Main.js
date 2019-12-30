// v1.0
Ext.define('vyl.view.main.Main', {
    extend: 'Ext.container.Viewport',

    requires: [
        'vyl.view.main.MainViewModel',
        'vyl.view.main.MainController',
        'vyl.view.main.MainContainerWrap',

        'vyl.view.login.Login',

        // MENU VENTAS
        'vyl.view.ventas.cierre.Formulario'
    ],

    controller: 'main',
    viewModel: 'main',

    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        beforerender: 'onMainViewBeforeRender'
    },

    items: [
        {
            xtype: 'toolbar',
            cls: 'pe-main-headerbar',
            height: 64,
            itemId: 'headerBar',
            //ui: 'main-header',            
            items: [
                {
                    xtype: 'component',
                    reference: 'haLogo',
                    cls: 'ha-logo',
                    html: '<div class="main-logo"><img src="resources/images/compustrom.png"><b style="position: relative; top: -20px;">Demo Lakus<b></div>',
                    width: 250 
                },
                {
                    margin: '0 0 0 8',
                    ui: 'header',
                    iconCls:'x-fa fa-navicon',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize',
                },
                '->',
                {
                    iconCls:'x-fa fa-envelope-open-o',
                    reference: 'btnMensajes',
                    ui: 'header',
                    handler: 'onMensajes',
                    tooltip: 'Mensajes Recibidos'
                },'-',
                {
                    xtype: 'tbtext',
                    reference: 'usrConectado',
                    cls: 'top-user-name'
                },
                {
                    xtype: 'image',
                    reference: 'usrImagen',
                    cls: 'header-right-profile-image',
                    height: 35,
                    width: 35,
                    alt: 'Imagen del Usuario Conectado',
                    src: 'resources/images/sin_foto.png'
                },'-',
                {
                    iconCls:'x-fa fa-power-off',
                    ui: 'header',
                    handler: 'onLogout',
                    tooltip: 'Salir del sistema'
                },

            ]
        },
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [
                {
                    xtype: 'treelist',
                    reference: 'navigationTreeList',
                    itemId: 'navigationTreeList',
                    ui: 'main-navigation',
                    bind: {
                        store: '{stNavigationTree}'
                    },
                    width: 250,
                    expanderFirst: false,
                    expanderOnly: false,
                    listeners: {
                        selectionchange: 'onNavigationTreeSelectionChange'
                    }
                },
                {
                    xtype: 'container',
                    flex: 1,
                    reference: 'mainCardPanel',
                    cls: 'pe-main-container',
                    itemId: 'contentPanel',
                    layout: {
                        type: 'card',
                        anchor: '100%'
                    }
                }
            ]
        }
    ]
});
