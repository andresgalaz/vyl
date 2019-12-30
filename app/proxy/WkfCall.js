Ext.define('vyl.proxy.WkfCall', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.wkfcall',

    type : 'ajax',
    method : 'POST',
    reader : {
        type : 'json',
        rootProperty : 'records',
        successProperty: 'success'
    },
    listeners: {
        exception: function(read, res, err, eOpts) {
            var me = this;

            if(!err.success) {
                var jsonRes = Ext.decode(res.responseText);

                if (jsonRes.message == 'No está conectado, o la sesión está vencida por tiempo') {
                    Ext.Msg.show({
                        title: 'OdontAr - Sistema Gestión Odontológica',
                        message: 'No está conectado, o la sesión está vencida por tiempo.<br>Debe volver a loguearse para continuar',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO,
                        fn: function(btn) {
                            if (btn === 'ok') {
                                me.pnLogin = Ext.create({
                                    xtype : 'login',
                                    listeners: {
                                        close: 'onLoginOk'
                                    }
                                }).show();
                            }
                        }
                    });
                } else {
                    console.error('Error inesperado:', jsonRes.message);
                    Ext.Msg.show({
                        title: 'Error Inesperado',
                        message: jsonRes.message,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        }
    }   
});