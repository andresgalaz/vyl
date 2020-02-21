Ext.define('vyl.view.tareas.asignacion.AsignacionGrillaUsrRoles', {
    extend: 'Ext.grid.Panel',
    xtype: 'asignaciongrillausrroles',

    requires: [
        'Ext.grid.feature.Grouping'
    ],

    // cls: 'asignacion-grilla',
    title: 'Tareas asignadas a Usuarios',
    scrollable: 'y',
    // height: 320,

    bind: '{stUsrDetalle}',

    columns: [
        {
            text: 'Rol',
            dataIndex: 'ROL',
            flex: 1
        },
        {
            text: 'Cant. Tareas',
            dataIndex: 'CANT_TAREAS',
            flex: 1
        }
    ],

    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            groupHeaderTpl: '{columnName}: <b>{renderedGroupValue}</b> (Total {[values.children[0].data["TOTAL_TAREAS"]]} {[values.children[0].data["TOTAL_TAREAS"] == 1 ? "Tarea Asignada" : "Tareas Asignadas"]})'
        }
    ],
});