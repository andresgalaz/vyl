Ext.define('vyl.view.login.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    init: function() {
        var me = this;

        me.titulo = 'Compustrom - Login';
    },

    onLogin: function() {
        var me = this,
            view = me.getView(),
            form = view.down('#frmAuthentication');

        form.submit({
            url : '../do/login',
            waitMsg : 'Conectando ... ',
            method : 'POST',
            success : function(frm, resp) {
                // Conexion OK 
                var usr = resp.result,
                    appCtrl = Ext.getApplication().getController('Conexion'),
                    oUsr = {};

                // Agregar control password caducada y pantalla actualizacion

                // Unifica el objeto usuario con el que devuelve do/estadoSesion
                oUsr['pUsuario'] = usr.PUSUARIO;
                oUsr['cUsuario'] = usr.CUSUARIO;
                oUsr['cNombre'] = usr.CNOMBRE;
                oUsr['cEmail'] = usr.CEMAIL;
                oUsr['bLDAP'] = usr.BLDAP;

                appCtrl.setUsuario(oUsr);
                view.close();
            },
            
            failure : function(frm, resp) {
                // Error al conectar
                console.warn('Conexion Fallida', resp.response.responseText);

                Ext.Msg.show({
                    title: 'Error en Login',
                    message: resp.response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },
});