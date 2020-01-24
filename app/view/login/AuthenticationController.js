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
        
        view.mask('Ingresando');

        form.submit({
            url : '../do/login',
            waitMsg : 'Conectando ... ',
            method : 'POST',
            success : function(frm, resp) {
                // Conexion OK 
                var usr = resp.result,
                    app = Ext.getApplication(),
                    mainCtrl = app.getMainView().getController(),
                    appCtrl = app.getController('Conexion'),
                    oUsr = {};

                // Agregar control password caducada y pantalla actualizacion

                // Unifica el objeto usuario con el que devuelve do/estadoSesion
                oUsr['pUsuario'] = usr.PUSUARIO;
                oUsr['cUsuario'] = usr.CUSUARIO;
                oUsr['cNombre'] = usr.CNOMBRE;
                oUsr['cEmail'] = usr.CEMAIL;
                oUsr['bLDAP'] = usr.BLDAP;

                appCtrl.setUsuario(oUsr);
                mainCtrl.onLoginOk();

                view.destroy();

                // Hace un F5 después de 300 milisegundos, suficiente
                // para que el usuario este correctamente logueado
                // setTimeout(() => {
                //     location.reload();
                // }, 300);               
            },
            
            failure : function(frm, resp) {
                // Error al conectar
                console.warn('Conexion Fallida', resp.response.responseText);
                view.unmask();

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