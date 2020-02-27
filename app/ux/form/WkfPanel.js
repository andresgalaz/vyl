Ext.define('vyl.ux.form.WkfPanel', {
    // Form que se vincula a un evento, por lo que lo primero que hace es tomar o crear el event y carga dinamicamente la botonera
    extend: 'Ext.form.Panel',
    xtype: 'wkfform',

    config: {
        flujo: null, 
        evento: 0,
        etapaActual: null,
        buttonSalir: true,
        buttonNuevo: true
    },

    url: GLOBAL.HOST+'/do/jsonCall',
    cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
    frame: false,
    scrollable: false,
    bodyPadding: 5,

    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 90,
        margin: '0 0 5 6'
    },

    listeners: {
        crearEvento: {
            fn: function(fn) {
                this.creaEvento(fn);
            }
        },

        leerEvento: {
            fn: function(fn) {
                this.leeEvento(fn);
            }
        }
    },

    constructor : function(config) {
        var me = this;
        
        me.callParent(arguments);
        me.initConfig(config);

        me.cargaBotoneraInicial();
    },

    cargaBotonera: function(obj) {
        // obj: Es el objeto que se recibe como respuesta del wkf
        var me = this,
            tlb = me.down('#tlbAcciones');

        // Agrega dinamicamente la botonera con los parametros que envia el wfk
        if (tlb) {
            me.removeDocked(tlb);
        }

        me.addDocked({
            xtype: 'wkfaccionestoolbar',
            reference: 'tlbAcciones',
            itemId: 'tlbAcciones',
            dock: 'bottom',
            // fixed: true,
            buttonSalir: me.getButtonSalir(),
            buttonNuevo: me.getButtonNuevo(),
            acciones: obj.dataWkf.acciones, 
            margin: '10 0 10 0'
        });
    },

    cargaBotoneraInicial: function() {
        var me = this,
            flujo = me.getFlujo();

        if (flujo) {
            Ext.Ajax.request({
                url : GLOBAL.HOST+'/do/wkfAccionesInicio',
                cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
                params : {
                    prm_cFlujo : flujo
                },

                success : function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        me.cargaBotonera(obj);

                    } else {
                        console.error('[cargaBotoneraInicial]', response.responseText);
                        Ext.Msg.show({
                            title: 'Workflow Panel',
                            message: 'Error inesperado',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        })
                    } 
                },
    
                failure : function(response, opts) {
                    console.error('[cargaBotoneraInicial] Falla del lado del servidor', response);
                    Ext.Msg.show({
                        title: 'Error Inesperado',
                        message: response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    })
                }
            });

        } else {
            console.error('[cargaBotoneraInicial] Falta parametro flujo', this);
        }
    },

    creaEvento: function(callback, pusuario, json_data) {
        var me = this,
            cxnCtrl = Ext.getApplication().getController('Conexion')
            flujo = me.getFlujo();
        
        if (flujo) {
            // Crea un evento para poder cargar la botonera
            Ext.Ajax.request({
                url : GLOBAL.HOST+'/do/wkfCreaEvento',
                cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
                params : {
                    prm_dataSource : cxnCtrl.getDefaultDS(), 
                    prm_cFlujo : flujo,
                    prm_pUsuario: pusuario ? pusuario : null,
                    json_data: json_data ? JSON.stringify(json_data) : null,
                },

                success : function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        me.cargaBotonera(obj);

                        me.setEvento(obj.dataWkf.eventoActual[0].pEvento);
                        me.setEtapaActual(obj.dataWkf.etapas[0].cNombre);
                        
                        if (callback){
                            callback();
                        } 

                    } else {
                        console.error('[creaEvento]', response);
                        Ext.Msg.show({
                            title: 'Workflow Panel',
                            message: 'Error inesperado',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });
                    }            
                },

                failure : function(response, opts) {
                    console.error('[creaEvento] Falla del lado del servidor', response);
                    Ext.Msg.show({
                        title: 'Workflow Panel',
                        message: 'Error Inesperado del servidor',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    })
                }
            });
        } else {
            console.warn('[creaEvento] Error en configuracion: valor flujo obligatio', this);
        }
    },

    leeEvento: function(callback) {
        var me = this,
            pEvento = me.getEvento(),
            cxnCtrl = Ext.getApplication().getController('Conexion');

        if (pEvento > 0) {
            Ext.Ajax.request({
                url : GLOBAL.HOST+'/do/wkfLeeEvento',
                cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
                params : {
                    prm_dataSource : cxnCtrl.getDefaultDS(), 
                    prm_nEvento : pEvento
                },
    
                success : function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        me.cargaBotonera(obj);
    
                        me.setEvento(obj.dataWkf.eventoActual[0].pEvento);
                        me.setEtapaActual(obj.dataWkf.etapas[0].cNombre);
                        me.setFlujo(obj.dataWkf.flujo.cNombre);

                        if (callback) {
                            callback(obj);
                        } 

                    } else {
                        console.error('[leeEvento]', response.responseText);
                        Ext.Msg.show({
                            title: 'Workflow Panel',
                            message: 'Error inesperado',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        })
                    } 
                },
    
                failure : function(response, opts) {
                    console.error('[leeEvento] Falla del lado del servidor', response);
                    Ext.Msg.show({
                        title: 'Error Inesperado',
                        message: response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    })
                }
            });
        } else {
            console.error('[leeEvento] Error: pEvento invalido', this);
        }
    },

    resetForm: function() {
        var me = this,
            flujo = me.getFlujo() ? me.getFlujo() : null,
            etapaActual = me.getEtapaActual() ? me.getEtapaActual() : null;

        me.reset();

        me.setFlujo(flujo);
        me.setEvento(0);
        me.setEtapaActual(etapaActual);

        me.cargaBotoneraInicial();
    }
});
