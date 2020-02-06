Ext.define('vyl.view.admin.cobranza.CobranzaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cobranza',

    init: function () {
        var me = this;

        me.defaultToken = Ext.getApplication().getDefaultToken();
        me.msgTitle = 'VYL - Cobranza';
    },

    onArchivoPagosChange: function(fld, value, eOpts ) {
        // TODO
        var me = this,
            refs = me.getReferences(),
            file = value.replace(/(^.*(\\|\/))?/, ""),
            vm = me.getViewModel();
        
        fld.setRawValue(file);

        refs.frmPanoramicaAdjuntar.submit({
            url: '../do/subirArchivo',
            success : function(form, action) {
                var obj = action.result;

                if (obj.success) {
                    //Graba url de la panoramica
                    Ext.Ajax.request({
                        url : '../do/jsonCall',
                        method : 'POST',
                        params : {
                            prm_funcion : 'odonto.js_odontograma.grabarPanoramicaUrl',
                            prm_paciente_id : paciente.PACIENTE_ID, 
                            prm_url : '../do/leerArchivo?cIdArchivo=' + obj.CIDARCHIVO, 
                            prm_archivo_id: obj.CIDARCHIVO, 
                            prm_user : cnxCtrl.getUsuarioId()
                        },
                        
                        success : function(response, opts) {
                            var rta = Ext.decode(response.responseText);
            
                            if (rta.success) {
                                stRxAdjuntos.reload();
                                Ext.toast('Archivo adjuntado con éxito', '¡Atención!', 'tl');

                            } else {
                                console.warn('[odonto.js_odontograma.GrabarAnotacion] Error', rta.message);
                                Ext.Msg.show({
                                    title: 'Ingreso Anotación',
                                    message: obj.message,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });
                                view.unmask();
                            }
                        },
            
                        failure : function(response, opts) {
                            console.error('[odonto.js_odontograma.GrabarAnotacion] Error', rta.message);
                            Ext.Msg.show({
                                title: 'Ingreso Anotación',
                                message: response.statusText,
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                            view.unmask();
                        }
                    });

                } else {
                    console.error('Error inesperado: ' + action.response.responseText);
                
                    Ext.Msg.show({
                        title: me.title,
                        message: action.response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            },

            failure : function(form, action) {
                console.error('Falla del lado del servidor: ' + action.response.responseText);
                
                Ext.Msg.show({
                    title: me.title,
                    message: action.response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                })
            }
        });
    },

    onArchivoPagosVer: function() {

    },

    onConsultaActivate: function() {
 
    }
});