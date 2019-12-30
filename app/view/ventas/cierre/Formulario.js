Ext.define('vyl.view.ventas.cierre.Formulario', {
    extend: 'vyl.ux.container.Main',
    xtype: 'ventas-cierre',
    
    requires: [
    ],

    // controller: '',
    // viewModel: {
    //     type: ''
    // },

    // cls: '',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // listeners: {
    //     activate: 'onActivate'
    // },

    items: [
        {
            xtype: 'uxform',
            reference: 'frmCierre',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldset',
                    name: '',
                    title: 'Datos',
                    items: []
                }
            ],
            flex: 1
        }
    ]
});