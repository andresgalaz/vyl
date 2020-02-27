Ext.define('vyl.view.tareas.asignacion.AsignacionRolUsuarios', {
    extend: 'Ext.form.Panel',
    xtype: 'asignacionrolusrs',

    itemId: 'frmRolUsr',
    
    height: 320,
    title: 'Asignacion de Usuarios por Rol',
    url: GLOBAL.HOST+'/do/jsonCall',
    cors:GLOBAL.CORS, withCredentials: true, useDefaultXhrHeader: false,
    // bodyPadding: 15,

    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 90,
        margin: '0 0 5 6'
    },

    bbar: {
        fixed: true,
        ui: 'wkf-tlb-acciones',  //Proviene de theme-pe
        margin: '10 0 0 0',
        defaults: {
            ui: 'wkf-tlb-acciones-toolbar'
        },
        items: [
            {
                text: 'Salir',
                iconCls: 'x-fa fa-sign-out',
                name: 'salir',
                handler: 'onSalir'
            },'-',
            {
                text: 'Limpiar',
                handler: 'onLimpiar',
                iconCls: 'x-fa fa-file'
            },'->',
            {
                text: 'Grabar',
                reference: 'btnGrabar',
                disabled: true,
                handler: 'onGrabar',
                ui: 'wkf-btn-ok',
                iconCls: 'x-fa fa-save'
            }
        ]
    },

    initComponent: function() {
        Ext.apply(this, {
            jsonSubmit: true,    
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                defaultType: 'textfield',
                layout: 'anchor',
                collapsible: true,
                margin: '5 10 5 10',
            },
            items: [
                {
                    xtype: 'combobox',
                    name: 'rol',
                    reference: 'rol',
                    fieldLabel: 'Rol',
                    editable: false,
                    allowBlank: false,
                    displayField: 'cRolTitulo',
                    valueField: 'cRol',
                    bind: {
                        store: '{stRoles}'
                    },
                    listeners: {
                        change: 'onSelectRol'
                    },
                },
                {
                    xtype: 'tagfield',
                    name: 'usuariosAsignados',
                    reference: 'tagUsrRol',
                    fieldLabel: 'Usuarios Asignados',
                    disabled: true,
                    bind: {
                        store: '{stUsuarios}'
                    },
                    displayField: 'cUsuarioNombre',
                    valueField: 'pUsuario',
                    filterPickList: true,
                    queryMode: 'local',
                    publishes: 'value',
                    flex: 1
                }
            ]
        });

        this.callParent(arguments);        
    }
});
