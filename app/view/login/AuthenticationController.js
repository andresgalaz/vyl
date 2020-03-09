Ext.define('vyl.view.login.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    onCambioPass: function() {
        var me = this,
            view = me.getView(),
            refs = view.getReferences(),
            app = Ext.getApplication(),
            cnxCtrl = app.getController('Conexion');

        refs.CUsuario.setValue(cnxCtrl.getCUsuario());   
        
        refs.frmCambioPass.submit({
            url : GLOBAL_HOST+'/do/cambioClave',
            cors: true, withCredentials: true, useDefaultXhrHeader: false,
            waitMsg : 'Actualizando Password ... ',
            method : 'POST',
            success : function(frm, resp) {
                var mainCtrl = app.getMainView().getController();

                mainCtrl.onLoginOk();
                view.destroy();
            },
            failure : function(frm, resp) {
                console.warn('[onCambioPass]', resp.response.responseText);
                Ext.Msg.show({
                    title: 'Compustrom - Actualización Password',
                    message: resp.response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    onLogin: function() {
        var me = this,
            view = me.getView(),
            form = view.down('#frmAuthentication');
        
        view.mask('Ingresando');

        form.submit({
            url : GLOBAL_HOST+'/do/login',
            cors: true, withCredentials: true, useDefaultXhrHeader: false,
            waitMsg : 'Conectando ... ',
            method : 'POST',
            success : function(frm, resp) {
                // Conexion OK 
                var usr = resp.result,
                    success = resp.result.success,
                    app = Ext.getApplication(),
                    mainCtrl = app.getMainView().getController(),
                    appCtrl = app.getController('Conexion'),
                    oUsr = {};

                if (success) {
                    view.unmask();

                    if (!usr.BVIGENTE) {
                        Ext.Msg.show({
                            title: 'Compustrom - Login',
                            message: 'Error en login, el usuario ingresado no se encuentra vigente',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });

                        return;    
                    }

                    // Unifica el objeto usuario con el que devuelve do/estadoSesion
                    oUsr['pUsuario'] = usr.PUSUARIO;
                    oUsr['cUsuario'] = usr.CUSUARIO;
                    oUsr['cNombre'] = usr.CNOMBRE;
                    oUsr['cEmail'] = usr.CEMAIL;
                    oUsr['bLDAP'] = usr.BLDAP;

                    appCtrl.setUsuario(oUsr);

                    // Control password caducada y pantalla actualizacion
                    if (usr.BPASSWORDCADUCADA) {
                        mainCtrl.onLoginCambioPass();
                        view.destroy();

                    } else {
                        mainCtrl.onLoginOk();
                        view.destroy();
                    }

                } else {
                    view.unmask();

                    Ext.Msg.show({
                        title: 'Compustrom - Login',
                        message: 'Error en login, verifique usuario y password',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
                // Hace un F5 después de 300 milisegundos, suficiente
                // para que el usuario este correctamente logueado
                // setTimeout(() => {
                //     location.reload();
                // }, 300);               
            },
            
            failure : function(frm, resp) {
                // Error al conectar
                console.warn('Conexion Fallida', resp.response);
                view.unmask();
                var rta = JSON.parse(resp.response.responseText);

                Ext.Msg.show({
                    title: 'Error en Login',
                    message: rta.message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    onRecuperarPass: function() {
        var me = this,
            view = me.getView(),
            url = window.location.origin + window.location.pathname,
            refs = view.getReferences();
        
        refs.Curl.setValue(url);

        refs.frmRecuperaPass.submit({
            url : GLOBAL_HOST+'/do/emailRecuperaClave',
            cors: true, withCredentials: true, useDefaultXhrHeader: false,
            waitMsg : 'Enviando mail recupero ... ',
            method : 'POST',
            success : function(frm, resp) {
                var resp = Ext.decode(response.responseText),
                    mainCtrl = app.getMainView().getController();
                
                if (resp.success) {
                    view.destroy();
                
                    Ext.Msg.show({
                        title: 'Compustrom - Recupero Password',
                        message: 'Mail de recupero enviado. Por favor verifique su casilla',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    
                    mainCtrl.onLogout();
                    
                } else {
                    console.warn('[onRecuperarPass]', resp);
                    Ext.Msg.show({
                        title: 'Compustrom - Recupero Password',
                        message: resp.message,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            },
            failure : function(frm, resp) {
                console.error('[onRecuperarPass]', resp.result.message);

                Ext.Msg.show({
                    title: 'Compustrom - Recuperar Password',
                    message: resp.result.message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    }
});
