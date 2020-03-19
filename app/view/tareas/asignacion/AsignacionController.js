Ext.define('vyl.view.tareas.asignacion.AsignacionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.asignacion',
    
    init: function() {
        var me = this;
        
        me.defaultToken = Ext.getApplication().getDefaultToken();
    },

    onActivate: function() {
        var me = this,
            stUsuarios = me.getViewModel().getStore('stUsuarios');

        stUsuarios.load();
    },

    onGrabar: function() {
        var me = this,
            view = me.getView(),
            refs = view.getReferences(),
            form = view.down('#frmAsignacionRolUsrs'),
            datos = form.getValues();

        if (datos) {
            view.mask('Grabando datos');
            
            Ext.Ajax.request({
                url: GLOBAL_HOST+'/do/wkfActualizaRolUsuario',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                params: {
                    prm_cJsonData : Ext.encode(datos)
                },
        
                success: function(response, opts) {
                    var rta = JSON.parse(response.responseText);

                    if(rta.success) {
                        var stRolUsuarios = me.getViewModel().getStore('stRolUsuarios'),
                            stRolDetalle = me.getViewModel().getStore('stRolDetalle');
                        
                        stRolUsuarios.load();
                        stRolDetalle.load();

                        form.reset();
                        refs.btnGrabar.setDisabled(true);
                        
                        Ext.Msg.show({
                            title: 'Asignación Rol / Usuario',
                            message: 'Selección grabada con éxito',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });

                    } else {
                        console.error(rta.message);
                        Ext.Msg.show({
                            title: 'Asignación Rol / Usuario',
                            message: response.responseText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });
                    }

                    view.unmask();
                },

                failure: function(response, opts) {
                    console.error('[onGrabar] Error en llamada : ' + response.status);
                    Ext.Msg.show({
                        title: 'Asignación Rol / Usuario',
                        message: response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });

                    view.unmask();
                }
            });
        }
    },

    onLimpiar: function() {
        var me = this,
            view = me.getView(),
            refs = view.getReferences(),
            form = view.down('#frmAsignacionRolUsrs');
        
        form.reset();
        refs.btnGrabar.setDisabled(true);
    },

    onSalir: function() {
        var me = this,
            view = me.getView(),
            form = view.down('#frmAsignacionRolUsrs');

        form.reset();
        me.redirectTo(me.defaultToken);
    },

    onSelectRol: function(cb, reg, eOpts) {
        var me = this,
            view = me.getView(),
            refs = view.getReferences();
        
        if (reg) {
            refs.btnGrabar.setDisabled(false);
            refs.tagUsrRol.setDisabled(false);
            refs.tagUsrRol.clearValue();

            // Carga en el tagFld de usuarios los que ya estaban asignados
            Ext.Ajax.request({
                // url: GLOBAL_HOST+'/do/vyl/bsh/wkfListaRolUsuarios.bsh',
                url: GLOBAL_HOST+'/do/wkfListaRolUsuarios',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                params: {
                    prm_cRol : reg
                },
           
                success: function(response, opts) {
                    var rta = JSON.parse(response.responseText);
    
                    if (rta.success) {
                        if (rta.response.length > 0) {
                            var arrUsr = [];
                            rta.response.forEach(function(usr){
                                arrUsr.push(usr.pUsuario);
                            });

                            refs.tagUsrRol.setValue(arrUsr);
                        }
                    } else
                        console.warn('[onSelectRol] Error inesperado en wkfListaRolUsuarios');
    
                },
                failure: function(response, opts) {
                    console.error('[onSelectRol] Error en llamada wkfListaRolUsuarios: ' + response.status);
                    Ext.Msg.show({
                        title: 'Asignación Rol / Usuario',
                        message: response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
        }
    },
});
