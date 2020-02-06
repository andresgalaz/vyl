Ext.define('vyl.view.admin.cobranza.ArchivosWnd', {
    extend: 'Ext.window.Window',
    xtype: 'wndarchivos',

    controller: 'cobranza',
    viewModel: {
        type: 'cobranza'
    },

    layout: {
        type:'vbox',
        align:'stretch'
    },

    height: 550,
    width: 600,
    scrollable: true,
    bodyPadding: 0,
    constrain: true,
    
    listeners: {
        beforerender: 'onArchivosWndBeforeRender'
    },

    initComponent: function() {
        Ext.apply(this, {
            title: 'Cobranzas - Archivos Procesados',
            modal: true,
            closable: false,   
            
            items: [
                {
                    xtype: 'grid',
                    scrollable: 'y',
                    viewConfig: {
                        stripeRows: true
                    },
                    bind: {
                        store: '{stArchivosCobranzasProcesados}',
                    },
                    emptyText: 'No existen archivos procesados',
                    columns: [
                        {
                            text: "Procesado",
                            dataIndex: '',
                            width: 130,
                            formatter: 'date("d/m/Y H:i:s")',
                        },
                        {
                            text: 'Nombre',
                            dataIndex: '',
                            flex: 1
                        },
                        {
                            text: 'Usuario',
                            dataIndex: '',
                            flex: 1
                        },
                    ],
                    flex: 1
                }
            ],    

            bbar: {
                fixed: true,
                ui: 'wkf-tlb-acciones',  //Proviene de theme-pe
                margin: '10 0 0 0',
                defaults: {
                    ui: 'wkf-tlb-acciones-toolbar'
                },
                items: [
                    '->',
                    {
                        xtype: 'button',
                        text: 'Cerrar',
                        handler: 'onArchivosWndCerrar',
                        ui: 'wkf-tlb-acciones-toolbar'
                    }
                ]
            }
        });

        this.callParent(arguments);
    }
});