Ext.define('vyl.ux.button.Accion', {
    extend: 'Ext.button.Button',
    alias: 'widget.wkfAccionButton',
    xtype: 'wkfaccionbutton',
    
    config: {
        idAccion: 0,
        cAccion: '',
        bRechaza: false
    },

    constructor : function(config) {
        var me = this;
        
        me.callParent(arguments);
        me.initConfig(config);
    },

    // Funcion que invoca al JAVA que convierte la jsonData a XML, toma los procedures del wkf y los ejecuta secuencialmente
    ejecutarAcciones : function(jsonData, idEvento, cEtapaActual, fnCallback, fecha_programada) {
        var me = this, 
            cAccion = me.getCAccion(),
            cxnCtrl = Ext.getApplication().getController('Conexion'), 
            mensaje = 'Error inesperado en botón ' + me.getText(),
            json = JSON.stringify(jsonData);

        Ext.Ajax.request({
            url : '../do/wkfAccionEvento',
            method : 'POST',
            params : {
                prm_dataSource : cxnCtrl.getDefaultDS(), 
                prm_nEvento: idEvento,
                prm_cEtapaActual: cEtapaActual,
                prm_cAccion: cAccion,
                prm_tProgramada: fecha_programada,
                json_data: json,
            },

            success : function(response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    // Estructura ver dataOut.json
                    if (fnCallback) {
                        fnCallback(obj);
                    }
                } else {
                    console.error('[ejecutarAcciones] Error inesperado: ' + response.responseText);
                    
                    // Para desa comentar
                    // if (obj.errorCode > 20000) {
                        mensaje = obj.message;
                    // }
                    
                    Ext.Msg.show({
                        title:'Botonera Workflow',
                        message: (mensaje ? mensaje : 'Error inesperado'),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                } 
            },


            failure : function(response, opts) {
                console.error('[ejecutarAcciones] Falla del lado del servidor: ' + response.statusText);
                Ext.Msg.show({
                    title:'Error inesperado',
                    message: 'Falla del lado del servidor',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    }
});