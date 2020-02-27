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

    bind: '{stRolUsuarios}',

    columns: [
        {
            text: 'Rol',
            dataIndex: 'cRolTitulo',
            flex: 1
        },
        {
            text: 'Cant. Tareas',
            dataIndex: 'nCantidadTareas',
            flex: 1
        }
    ],

    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            groupHeaderTpl: 'Usuario: <b>{renderedGroupValue}</b> (Total {[values.children[0].data["nCantidadTareas"]]} {[values.children[0].data["nCantidadTareas"] == 1 ? "Tarea Asignada" : "Tareas Asignadas"]})'
        }
    ],
});