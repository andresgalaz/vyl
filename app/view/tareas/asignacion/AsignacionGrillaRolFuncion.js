Ext.define('vyl.view.tareas.asignacion.AsignacionGrillaRolFuncion', {
    extend: 'Ext.grid.Panel',
    xtype: 'asignaciongrillarolfn',

    requires: [
        'Ext.grid.feature.Grouping'
    ],

    // cls: 'asignacion-grilla',
    title: 'Tareas por Rol',
    scrollable: 'y',

    bind: '{stRolDetalle}',

    columns: [
        {
            text: 'Tarea',
            dataIndex: 'TAREA',
            flex: 1
        },
        {
            text: 'Hs. Estimadas',
            dataIndex: 'HS_ESTIMADAS',
            width: 100
        },
        {
            text: 'Circuito',
            dataIndex: 'CIRCUITO',
            flex: 1
        }
    ],

    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            groupHeaderTpl: '{columnName}: <b>{renderedGroupValue}</b> ({[values.children[0].data["CANT_USRS_ASIGNADOS"]]} {[values.children[0].data["CANT_USRS_ASIGNADOS"] == 1 ? "Usuario Asignado" : "Usuarios Asignados"]})'
        }
    ],
});