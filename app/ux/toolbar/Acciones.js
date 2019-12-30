Ext.define('vyl.ux.toolbar.Acciones', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.wkfAccionesToolbar',
    xtype: 'wkfaccionestoolbar',

    config: {
        acciones: []
    },

    defaultType: 'button',
    fixed: true,
    ui: 'wkf-tlb-acciones',  //Proviene de theme-pe

    constructor : function(config) {
        var me = this;
        
        me.callParent(arguments);
        me.initConfig(config);

        if (me.getAcciones()) {
            me.cargaBotonera();
        } else {
            me.add({
                xtype: 'button',
                text: 'Salir',
                iconCls: 'x-fa fa-sign-out',
                ui: 'wkf-tlb-acciones-toolbar',
                name: 'salir',
                handler: 'onWkfAccion'
            });
        }
    },
    
    cargaBotonera : function() {
        var me = this,
            botones = me.getAcciones(),
            config = {},
            mainController = Ext.getApplication().getMainView().getController(),
            node = mainController.getActiveNode(),
            pTpAcceso = 0;

        me.removeAll();

        // if (DEBUG) console.log('[cargaBotonera] node', node.data);
        switch (node.data.cTpAcceso) {
            case "READ":
                pTpAcceso = 10;
            break;
        
            case "EXECUTE":
                pTpAcceso = 20;
            break;

            case "WRITE":
                pTpAcceso = 30;
            break;

            case "WRITE MASTER":
                pTpAcceso = 32;
            break;

            case "DELETE":
                pTpAcceso = 40;
            break;

            default:
                pTpAcceso = 10;
            break;
        }

        me.add({
            xtype: 'button',
            text: 'Salir',
            iconCls: 'x-fa fa-sign-out',
            ui: 'wkf-tlb-acciones-toolbar',
            name: 'salir',
            handler: 'onWkfAccion'
        },'-');

        // Para utilizar la botonera se requieren permisos mayores a READ
        if (botones && pTpAcceso > 10) {
            botones.forEach(function(btn) {
                config = {};
    
                if (btn.cEstilo) {
                    config = Ext.decode(btn.cEstilo);
                }
                
                if (config.extjs) {
                    if (config.extjs.separador) {
                        me.add(config.extjs.separador);
                    }
    
                    me.add({
                        xtype: 'wkfaccionbutton',
                        idAccion: btn.pAccion,
                        cAccion: btn.cNombre,
                        bRechaza: config.extjs.btn_rechazo ? config.extjs.btn_rechazo : false,
                        ui: config.extjs.ui ? config.extjs.ui : 'wkf-tlb-acciones-toolbar',
                        iconCls: config.extjs.icono ? config.extjs.icono : null,
                        name: btn.cNombre,
                        text: btn.cTitulo,
                        formBind: config.extjs.habilita_form ? config.extjs.habilita_form : false,
                        hidden: config.extjs.oculto ? config.extjs.oculto : false,
                        disabled: config.extjs.pTpAcceso <= pTpAcceso ? false : true,
                        handler: 'onWkfAccion'  //IMPORTANTE: Implementar esta funcion en el controller de la view donde se agrega esta toolbar 
                    });
                } else {
                    me.add({
                        xtype: 'wkfaccionbutton',
                        idAccion: btn.pAccion,
                        cAccion: btn.cNombre,
                        bRechaza: false,
                        ui: 'wkf-tlb-acciones-toolbar',
                        iconCls:  null,
                        name: btn.cNombre,
                        text: btn.cTitulo,
                        formBind:  false,
                        hidden: false,
                        handler: 'onWkfAccion'  //IMPORTANTE: Implementar esta funcion en el controller de la view donde se agrega esta toolbar 
                    });
                }
            });
        }
    }
});