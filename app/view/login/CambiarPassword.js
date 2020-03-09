Ext.define('vyl.view.login.CambiarPassword', {
    extend: 'vyl.view.login.LoginBase',
    xtype: 'pass_cambiar',

    requires: [
        'vyl.override.AdvancedVType'
    ],

    title: 'Compustrom - Lakus Sistema de Venta y Leasing',

    items: [
        {
            xtype: 'form',
            reference: 'frmCambioPass',
            defaultButton : 'cambiarButton',
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
                inputType: 'password',
                allowBlank : false,
            },

            fieldDefaults: {
                msgTarget: 'side',
                autoFitErrors: false
            },

            items: [
                {
                    xtype: 'hidden',
                    name: 'CUsuario',
                    reference: 'CUsuario'
                },
                {                    
                    emptyText: 'Password Anterior',
                    name: 'CPasswordActual'
                },
                {
                    emptyText: 'Nueva Password',
                    name: 'CPasswordNueva',
                    itemId: 'pass_nueva',
                    vtype: 'passwordCheck'
                },
                {
                    emptyText: 'Confirme Password',
                    submitValue: false,
                    vtype: 'passwordMatch',
                    initialPassField: 'pass_nueva'
                },
                {
                    xtype: 'button',
                    reference: 'cambiarButton',
                    scale: 'large',
                    ui: 'soft-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Actualizar Password',
                    formBind: true,
                    listeners: {
                        click: 'onCambioPass'
                    }
                }
            ]
        }
    ]
});