Ext.define('vyl.view.tareas.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',
    
    init: function() {
        var me = this;
        
        this.autoRefresh = false;
    },

    actualizar: function() {
        var me = this,
            cxnCtrl = Ext.getApplication().getController('Conexion'),
            refs = me.getReferences(),
            st = me.getViewModel().getStore('stTareasPendientes'),
            date = new Date,
            opcion = me.getReferences().sbVerTareas.getValue(),
            filtros = st.getFilters();


        function propias (item) {
            var data = item.getData(),
                cxnCtrl = Ext.getApplication().getController('Conexion');

            return data.pUsuarioAsignado == cxnCtrl.getUsuarioId();
        }

        function equipo (item) {
            var data = item.getData(),
                cxnCtrl = Ext.getApplication().getController('Conexion');

            return data.pUsuarioAsignadoPadre == cxnCtrl.getUsuarioId();
        }
        
        filtros.removeAll();
        refs.gdPendientes.mask('Actualizando');

        switch (opcion) {
            case 'tareas_propias':
                refs.colUsuarioAsignado.setHidden(true);

                filtros.add(propias);

                st.load({
                    scope: this,
                    callback: function(records, operation, success) {
                        refs.gdPendientes.unmask();
                    }
                });
            break;

            case 'tareas_a_cargo':
                refs.colUsuarioAsignado.setHidden(false);

                filtros.add(equipo);

                st.load({
                    scope: this,
                    callback: function(records, operation, success) {
                        refs.gdPendientes.unmask();
                    }
                });
            break;

            case 'tareas_todas':
                refs.colUsuarioAsignado.setHidden(false);

                st.load({
                    scope: this,
                    callback: function(records, operation, success) {
                        refs.gdPendientes.unmask();
                    }
                });
            break;
            
            default:
                console.warn('Filtro invalido');
            break;
        }

        refs.txUltimaActualizacion.setText('Última actualización: ' + date.toLocaleTimeString());

        if (!me.autoRefresh) {
            me.autoRefresh = true;

            Ext.Function.defer(function(){
                // if (DEBUG) console.log('[onactualizar]',date);
                me.actualizar();
            }, 180000);  //Refresca cada 3 minutos
        }

        // Verifica nuevos mensajes
        // me.verificarMensajes();
    },

    // derivarTarea: function() {
    //     var me = this,
    //         view = me.getView(),
    //         refs = view.getReferences(),
    //         mainController = Ext.getApplication().getMainView().getController(),
    //         node = mainController.getActiveNode(),
    //         tpAcceso = node.data.cTpAcceso,
    //         st = me.getViewModel().getStore('stTareasPendientes'),
    //         row = refs.gdPendientes.getSelection();
        
    //     if (row) {
    //         // No se pueden derivar tareas que no son propias salvo DELETE 
    //         var data = row[0].data;

    //         if (data.pUsuarioAsignado != oGlobal.pUsuario && tpAcceso != 'DELETE') {
    //             Ext.Msg.show({
    //                 title: 'Dashboard Tareas',
    //                 message: 'Esta tarea fue asignada a ' + data.cUsuarioAsignadoNombre + '.<br>No tiene permisos para derivarla.',
    //                 buttons: Ext.Msg.OK,
    //                 icon: Ext.Msg.WARNING
    //             });
                
    //         } else {
    //             var evento_id = data.pEvento,
    //                 secuencia_id = data.pSecuencia,
    //                 wnd = Ext.create({
    //                     xtype: 'wndderivacion',
    //                     eventoId: evento_id,
    //                     secuenciaId: secuencia_id
    //                 }).show();
    
    //             wnd.on('actualizar', function(){
    //                 me.actualizar();
    //             });
    //         }

    //         st.reload();

    //     } else {
    //         Ext.Msg.show({
    //             title: 'Dashboard Tareas',
    //             message: 'Debe seleccionar una tarea',
    //             buttons: Ext.Msg.OK,
    //             icon: Ext.Msg.WARNING
    //         });
    //     }
    // },

    permisos: function() {
        var me = this,
            refs = me.getReferences(),
            mainController = Ext.getApplication().getMainView().getController(),
            node = mainController.getActiveNode();

        switch (node.data.cTpAcceso) {
            case 'WRITE MASTER':
            case 'DELETE':
            case 'WRITE':
                refs.btnTareasTodas.setDisabled(false);
                refs.btnTareaDerivar.setDisabled(false);
                break;

            case 'READ':
            default:
                refs.btnTareasTodas.setDisabled(true);
                refs.btnTareaDerivar.setDisabled(true);
                break;
        }
    },

    resolverTarea: function(pEvento, pSecuencia) {
        var me = this,
            cxnCtrl = Ext.getApplication().getController('Conexion'),
            view = me.getView(),
            refs = view.getReferences(),
            mainController = Ext.getApplication().getMainView().getController(),
            node = mainController.getActiveNode(),
            tpAcceso = node.data.cTpAcceso,
            st = me.getViewModel().getStore('stTareasPendientes'),
            row = [],
            token = '',
            tarea = {};
        
        if (pEvento && pSecuencia) {
            var data;
            st.getData().items.forEach(function(reg) {
                data = reg.data;

                if (data.pEvento == pEvento && data.pSecuencia == pSecuencia) {
                    row.push(reg);
                }
            });
        } else {
            row = refs.gdPendientes.getSelection(); 
        }
        
        if (row.length > 0) {
            tarea = row[0].data;
            
            // No se pueden resolver tareas que no son propias salvo DELETE 
            if ( tarea.pUsuarioAsignado != cxnCtrl.getUsuarioId() && tpAcceso != 'DELETE') {
                Ext.Msg.show({
                    title: 'Dashboard Tareas',
                    message: 'Esta tarea fue asignada a ' + tarea.cUsuarioAsignadoNombre + '.<br>No tiene permisos para resolverla.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });

            } else {
                // Obtiene el token para redireccionar al modulo que resuelva la tarea
                if (tarea.pEvento > 0 && tarea.cUrl) {
                    token = tarea.cUrl + '/' + tarea.pEvento;

                    me.redirectTo(token);
                
                } else {
                    console.error('[resolverTarea] No se puede resolver token', tarea);
                    // NO TIENE TOKEN => No puede direccionar al modulo para resolver la tarea
                }
            }

            // Recarga grilla tareas pendientes
            st.reload();
        } else {
            Ext.Msg.show({
                title: 'Dashboard Tareas',
                message: 'Debe seleccionar una tarea',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
        }
    },

    verificarMensajes: function() {
        var me = this;

        Ext.Ajax.request({
            url : GLOBAL.HOST+'/do/jsonCall',
            cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
            method : 'POST',
            params : {
                prm_funcion : 'PE.JS_PE_MENSAJERIA.operConsultaMensajesNuevosCant',
                prm_usuario: cxnCtrl.getUsuarioId()
            },
            
            success : function(response, opts) {
                var obj = Ext.decode(response.responseText),
                    mainView = Ext.getApplication().getMainView(),
                    refs = mainView.getReferences(),
                    cant = '';

                if (obj.success) {
                    if (obj.RETURN > 0) {
                        cant = ' (' + obj.RETURN + ')';

                        refs.btnMensajes.setText(cant);
                        refs.btnMensajes.setIconCls('x-fa fa-envelope');
                    } else {
                        refs.btnMensajes.setText(null);
                        refs.btnMensajes.setIconCls('x-fa fa-envelope-open-o');
                    }
                }
            },

            failure : function(response, opts) {
                console.error('Falla del lado del servidor, código respuesta: ' + response.status);
                
                view.unmask();
                Ext.Msg.show({
                    title: 'Main',
                    message: response.statusText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },
    onActivate: function() {
        this.permisos();
        this.actualizar();
    },

    onAfterRender: function() {
        this.actualizar();
    },

    // onDerivarTarea:  function(btn, ev, eOpts) {
    //     this.derivarTarea();
    // },

    onGrillaPendientesDblClick: function(grid, record, element, rowIndex, e, eOpts) {
        var me = this,
            rec = grid.getStore().getAt(rowIndex);
        
        me.resolverTarea(rec.data.pEvento, rec.data.pSecuencia);
    },
    
    onGrillaPendientesAfterRender: function(grid, eOpts){
        var me = this;
    },

    onGrillaPendientesExpand: function (rowNode, record, expandRow, eOpts) {
        var detailData = Ext.DomQuery.select("div.detailData", expandRow),
            evento_id = record.get('pEvento'),
            cxnCtrl = Ext.getApplication().getController('Conexion'), 
            html = "";

        if (detailData) {
            Ext.Ajax.request({
                url : GLOBAL.HOST+'/do/vyl/bsh/ventaByEvento.bsh',
                cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
                params : {
                    prm_dataSource: cxnCtrl.getDefaultDS(),
                    prm_fEvento: evento_id
                },
    
                success : function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success && obj.count == 1) {
                        var data = obj.records[0];
                        html = "<p><b>Paciente:</b> " + data.PACIENTE_AYN + " - <b>Credencial:</b> " + data.PACIENTE_CREDENCIAL + "</p><p><b>Programa Especial:</b> " + data.PACIENTE_PROGRAMA + "</p><p><b>Circuito: </b>" + data.TAREA_FLUJO + "</p>";
                        
                        if (data.TAREA_DETALLE) {
                            html += "<p><b>Detalle Tarea:</b> " + data.TAREA_DETALLE + "</p>"
                        }
                        detailData[0].innerHTML = html;
                    } else {
                        console.error('[onGrillaPendientesExpand] Error inesperado: ' + response.responseText);
                    } 
                },
                failure : function(response, opts) {
                    console.error('[onGrillaPendientesExpand] Falla del lado del servidor, código respuesta: ' + response.status);
                }
            });
        }
    },

    onLoadStTareasPendientes: function(st, records, successful, operation, eOpts ){
        var me = this,
            stTareasPendientesLocal = me.getViewModel().getStore('stTareasPendientesLocal');
        
        stTareasPendientesLocal.getProxy().setData(st.getRange());
        stTareasPendientesLocal.load();
    },

    onRefrescar: function() {
        this.actualizar();
    },

    onResolverTarea: function(btn, ev, eOpts) {
        this.resolverTarea();
    }
});
