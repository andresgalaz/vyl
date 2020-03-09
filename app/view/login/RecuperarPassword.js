Ext.define('vyl.view.login.RecuperarPassword', {
    extend: 'vyl.view.login.LoginBase',
    xtype: 'pass_recupera',

    items: [
        {
            xtype: 'form',
            reference: 'frmRecuperaPass',
            defaultButton : 'recuperarButton',
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 415,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin : '5 0',
                xtype: 'textfield',
                cls: 'auth-textbox',
                height: 55,
                hideLabel: true,
                allowBlank : false,
            },

            fieldDefaults: {
                msgTarget: 'side',
                autoFitErrors: false
            },

            items: [
                {
                    xtype: 'hidden',
                    name: 'prm_cUrl',
                    reference: 'Curl'
                },
                {                    
                    emptyText: 'Email registrado',
                    vtype: 'email',
                    name: 'prm_cEmail'
                },
                {
                    xtype: 'button',
                    reference: 'recuperarButton',
                    scale: 'large',
                    ui: 'soft-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Recuperar Password',
                    formBind: true,
                    listeners: {
                        click: 'onRecuperarPass'
                    }
                }
            ]
        }
    ]
});