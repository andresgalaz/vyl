/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'vyl.Application',

    name: 'vyl',

    requires: [
        // This will automatically load all classes in the PE namespace
        // so that application classes do not need to require each other.
        'vyl.*'
    ],

    // The name of the initial view to create.
    mainView: 'vyl.view.main.Main',
    defaultToken : 'ventas-cierre-consulta',

    launch: function () {
        var app = this,
            mainCtrl = app.getMainView().getController()
            cnxCtrl = app.getController('Conexion');

        Ext.Ajax.request({
            url: '../do/estadoSesion',
            method: 'POST',
            success: function (rSesion) {
                var sesion = Ext.decode(rSesion.responseText),
                    oUsr = {};

                setTimeout(function() {
                    if (!sesion.bConectado) {
                        console.log('[launch] Usuario no conectado');
                        mainCtrl.doLogin();

                    } else {
                        console.log('[launch] Usuario conectado');   
                        
                        oUsr['pUsuario'] = sesion.pUsuario;
                        oUsr['cUsuario'] = sesion.cUsuario;
                        oUsr['cNombre'] = sesion.cNombre;
                        oUsr['cEmail'] = sesion.cEmail;
                        oUsr['bLDAP'] = sesion.bLDAP;

                        cnxCtrl.setUsuario(oUsr);
                        mainCtrl.onLoginOk();
                    }
                }, 1000);
            }
        });
    }
});