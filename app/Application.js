/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('vyl.Application', {
    extend: 'Ext.app.Application',

    controllers: 'Conexion',

    name: 'vyl',
    quickTips: false,
    
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Compustrom', 'Existe una nueva versión de esta aplicación, ¿Desea recargar?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
