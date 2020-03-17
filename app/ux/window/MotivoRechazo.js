Ext.define('vyl.ux.window.MotivoRechazo', {
    extend: 'Ext.window.Window',
    xtype: 'wndmotivorechazo',
    
    requires: [
        'vyl.ux.window.MotivoRechazoController'
    ],

    controller: 'motivorechazo',

    layout: {
        type:'vbox',
        align:'stretch'
    },

    //Config Propio
    ingresaMotivo: true, 

    height: 400,
    width: 400,
    scrollable: true,
    bodyPadding: 0,
    constrain: true,
    modal: true,
    closable: false,

    listeners: {
        afterrender: 'onAfterRender'
    },

    initComponent: function() {
        Ext.apply(this, {
            items: [
                {
                    xtype: 'textarea',
                    reference: 'txaRechazo',
                    labelAlign: 'top',
                    labelWidth: 90,
                    margin: '0 5 5 5',
                    grow: true,
                    name: 'rechazo',
                    fieldLabel: 'Ingrese motivo del rechazo',
                    allowBlank: false,
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    fixed: true,
                    ui: 'wkf-tlb-acciones',
                    margin: '0 0 5 0',
                    defaultButtonUI: 'wkf-tlb-acciones-toolbar',
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            reference: 'btnCancelar',
                            text: 'Cancelar',
                            handler: 'onCancelar', 
                            iconCls: 'x-fa fa-ban'
                        },
                        {
                            xtype: 'button',
                            reference: 'btnAceptar',
                            text: 'Aceptar',
                            handler: 'onAceptar',
                            hidden: true,
                        },
                        {
                            xtype: 'button',
                            reference: 'btnFinalizar',
                            text: 'Finalizar',
                            handler: 'onGrabar',
                            iconCls: 'x-fa fa-arrow-circle-right'
                        },
                    ]
                }
            ],
        });

        this.callParent(arguments);
    },

    getIngresaMotivo: function() {
        return this.ingresaMotivo;
    }
});
