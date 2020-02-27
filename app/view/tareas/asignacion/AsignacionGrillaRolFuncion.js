Ext.define('vyl.view.tareas.asignacion.AsignacionGrillaRolFuncion', {
    extend: 'Ext.grid.Panel',
    xtype: 'asignaciongrillarolfn',

    requires: [
        'Ext.grid.feature.Grouping'
    ],

    title: 'Tareas por Rol',
    scrollable: 'y',

    bind: '{stRolDetalle}',

    columns: [
        {
            text: 'Tarea',
            dataIndex: 'cEtapaTitulo',
            flex: 1
        },
        {
            text: 'Hs. Estimadas',
            dataIndex: 'nDuracionHoras',
            width: 100
        },
        {
            text: 'Flujo',
            dataIndex: 'cFlujoTitulo',
            flex: 1
        }
    ],

    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            groupHeaderTpl: 'Rol: <b>{renderedGroupValue}</b> ({[values.children[0].data["nUsuariosAsignados"]]} {[values.children[0].data["nUsuariosAsignados"] == 1 ? "Usuario Asignado" : "Usuarios Asignados"]})'
        }
    ],
});