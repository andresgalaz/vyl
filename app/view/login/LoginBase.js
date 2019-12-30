Ext.define('vyl.view.login.LoginBase', {
    extend: 'Ext.window.Window',
    xtype: 'loginwindow',

    requires: [
        'vyl.view.login.AuthenticationController',
        'vyl.view.login.AuthenticationViewModel'
    ],
    
    controller: 'authentication',
    viewModel: {
        type: 'authentication'
    },

    cls: 'auth-locked-window',

    closable: false,
    resizable: false,
    autoShow: true,
    titleAlign: 'center',
    maximized: true,
    modal: true,
    scrollable: true,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});