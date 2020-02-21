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
            datos = form.getValues(),
            x2Js = new X2JS(),
            strXml, xmlData;
        
        // if (DEBUG) console.log('onGrabar', datos);

        xmlData = x2Js.json2xml_str(datos);

        if (xmlData) {
         
            strXml = '<datos>' + xmlData + '</datos>';

            view.mask();
            
            Ext.Ajax.request({
                url: '../do/jsonCall',

                // TODO: Implementar funcion
                params: {
                    prm_funcion : 'PE.JS_PE_TAREAS.operGrabarRolUsuario',
                    prm_xml : strXml
                },
        
                success: function(response, opts) {
                    var rta = JSON.parse(response.responseText);

                    if(rta.success) {
                        var stUsrDetalle = me.getViewModel().getStore('stUsrDetalle'),
                            stRolDetalle = me.getViewModel().getStore('stRolDetalle');
                        
                        stUsrDetalle.load();
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
                url: '../do/jsonCall',
    
                // TODO: Implementar funcion
                params: {
                    prm_funcion : 'PE.JS_PE_TAREAS.operConsultaUsuariosRol',
                    prm_rol : reg
                },
           
                success: function(response, opts) {
                    var rta = JSON.parse(response.responseText);
    
                    if(rta.success) {
                        if (rta.count > 0) {
                            var arrUsr = [];
                            rta.records.forEach(function(usr){
                                arrUsr.push(usr.USUARIO);
                            });

                            refs.tagUsrRol.setValue(arrUsr);
                        }
                    } else
                        console.warn(rta.message);
    
                },
                failure: function(response, opts) {
                    console.error('[onSelectRol] Error en llamada PE.JS_PE_TAREAS.operConsultaUsuariosRol: ' + response.status);
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