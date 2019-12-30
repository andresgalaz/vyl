Ext.define('vyl.ux.form.WkfPanel', {
    // Form que se vincula a un evento, por lo que lo primero que hace es tomar o crear el event y carga dinamicamente la botonera
    extend: 'Ext.form.Panel',
    xtype: 'wkfform',

    config: {
        flujo: null, 
        evento: 0,
        etapaActual: null
    },

    url: '../do/jsonCall',
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
            acciones: obj.dataWkf.acciones, 
            margin: '10 0 10 0'
        });
    },

    creaEvento: function(callback, pusuario, json_data) {
        var me = this,
            flujo = me.getFlujo();
        
        if (flujo) {
            // Crea un evento para poder cargar la botonera
            Ext.Ajax.request({
                url : '../do/wkfCreaEvento',
                method : 'POST',
                params : {
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
                        console.error(response.responseText);
                        Ext.Msg.show({
                            title: 'Solicitud de Ingreso',
                            message: 'Error inesperado',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        })
                    }            
                },

                failure : function(response, opts) {
                    console.error('Falla del lado del servidor, código respuesta: ' + response.status, response.responseText);
                    Ext.Msg.show({
                        title: 'Solicitud de Ingreso',
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
            pEvento = me.getEvento();

        if (pEvento > 0) {
            Ext.Ajax.request({
                url : '../do/wkfLeeEvento',
                method : 'POST',
                params : {
                    // prm_dataSource : 'xgenJNDI', 
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
                        console.error(response.responseText);
                        Ext.Msg.show({
                            title: 'Solicitud de Ingreso',
                            message: 'Error inesperado',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        })
                    } 
                },
    
                failure : function(response, opts) {
                    console.error('Falla del lado del servidor, código respuesta: ' + response.status);
                    Ext.Msg.show({
                        title: 'Error Inesperado',
                        message: response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    })
                }
            });
        } else {
            console.warn('[leeEvento] Error: pEvento invalido', this);
        }
    },

    resetForm: function() {
        var me = this;

        me.reset();
        me.setFlujo('');
        me.setEvento(0);
        me.setEtapaActual(null);
    }
});