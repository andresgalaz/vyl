Ext.define('vyl.view.admin.cobranza.CobranzaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cobranza',

    init: function () {
        var me = this;

        me.defaultToken = Ext.getApplication().getDefaultToken();
        me.msgTitle = 'VYL - Cobranza';
    },

    onArchivoCobranzasChange: function(fld, value, eOpts ) {
        var file = value.replace(/(^.*(\\|\/))?/, "");
        
        fld.setRawValue(file);
    },

    onArchivoCobranzasProcesar: function(fld, value, eOpts ) {
        var me = this,
            refs = me.getReferences(),
            vm = me.getViewModel()
            view = me.getView();

        view.mask('Procesando archivo cobranzas');

        refs.frmProcesarArchivo.submit({
            url: GLOBAL_HOST+'/do/subirArchivo',
            cors: true, withCredentials: true, useDefaultXhrHeader: false,
            success : function(form, action) {
                var obj = action.result;

                if (obj.success) {
                    Ext.Ajax.request({
                        url : GLOBAL_HOST+'/do/vyl/bsh/leasingProcesaPagos.bsh',
                        cors: true, withCredentials: true, useDefaultXhrHeader: false,
                        method : 'POST',
                        params : {
                        	prm_dataSource: 'vylDS',
                        	prm_cIdArchivo: obj.CIDARCHIVO
                        },
                        
                        success : function(response, opts) {
                            var rta = Ext.decode(response.responseText);
            
                            if (rta.success) {
                            	if(rta.message)
                                    Ext.toast(rta.message, '¡Atención!', 'tl');
                            	else
                            		Ext.toast('Archivo procesado con éxito', '¡Atención!', 'tl');
                                view.unmask();

                            } else {
                                console.warn('[] Error', rta.message);
                                Ext.Msg.show({
                                    title: 'Cobranzas',
                                    message: rta.message,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });
                                view.unmask();
                            }
                        },
            
                        failure : function(response, opts) {
                            console.error('[] Error', rta.message);
                            Ext.Msg.show({
                                title: 'Cobranzas',
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
                    view.unmask();
                }
            },

            failure : function(form, action) {
                console.error('Falla del lado del servidor: ' + action.response.responseText);
                Ext.Msg.show({
                    title: me.title,
                    message: action.response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                view.unmask();
            }
        });
    },

    onArchivoCobranzasVer: function() {
        var me = this,
            wnd = Ext.create({
                xtype: 'wndarchivos',
                reference: 'archivosWnd'
            }).show();
    },

    onArchivosWndBeforeRender: function() {    
    },

    onArchivosWndCerrar: function() {
        var me = this,
            wnd = me.getView();
        
        wnd.destroy();
    },

    onConsultaActivate: function() {
 
    }
});
