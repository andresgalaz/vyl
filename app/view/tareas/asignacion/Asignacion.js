Ext.define('vyl.view.tareas.asignacion.Asignacion', {
    extend: 'Ext.container.Container',
    xtype: 'tareas-rol-usr',
    
    requires: [
        'vyl.view.tareas.asignacion.AsignacionController',
        'vyl.view.tareas.asignacion.AsignacionViewModel',
        'vyl.view.tareas.asignacion.AsignacionRolUsuarios',
        'vyl.view.tareas.asignacion.AsignacionGrillaRolFuncion',
        'vyl.view.tareas.asignacion.AsignacionGrillaUsrRoles',
    ],

    controller: 'asignacion',
    viewModel: {
        type: 'asignacion'
    },

    listeners: {
        activate: 'onActivate'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    margin: '10 20 0 20',

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'asignaciongrillarolfn',
                    reference: 'gpAsignacionRolFn',
                    scrollable: true,
                    flex: 1,
                    margin: '0 10 0 0'
                },
                {
                    xtype: 'asignaciongrillausrroles',
                    reference: 'gpAsignacionUsrsRoles',
                    scrollable: true,
                    flex: 1
                },
            ],

            maxHeight: 450,
            flex : 2
        },
        {
            xtype: 'container',
            layout: {
                type : 'anchor',
                anchor : '100%'
            },

            margin: '10 0 0 0',

            items: [
                {
                    xtype: 'asignacionrolusrs',
                    itemId: 'frmAsignacionRolUsrs'
                }
            ],

            flex : 1,
        }
    ]
});