Ext.define('Ext.grid.RowEditorButtons', {
    override :'Ext.grid.RowEditorButtons',

    constructor: function(config) {
        var me = this,
            rowEditor = config.rowEditor,
            cssPrefix = Ext.baseCSSPrefix,
            plugin = rowEditor.editingPlugin;

        config = Ext.apply({
            baseCls: cssPrefix + 'grid-row-editor-buttons',
            defaults: {
                xtype: 'button',
                // ui: rowEditor.buttonUI,
                ui: 'wkf-tlb-acciones-toolbar',
                scope: plugin,
                flex: 1,
                minWidth: Ext.panel.Panel.prototype.minButtonWidth,
                height: 24,
                style: 'padding: 0'
            },
            items: [
                {
                    cls: cssPrefix + 'row-editor-update-button',
                    itemId: 'update',
                    handler: plugin.completeEdit,
                    // text: rowEditor.saveBtnText,
                    text: 'Actualizar',
                    disabled: rowEditor.updateButtonDisabled,
                    listeners: {
                        element: 'el',
                        keydown: me.onUpdateKeyDown,
                        scope: me
                    }
                }, 
                {
                    cls: cssPrefix + 'row-editor-cancel-button',
                    itemId: 'cancel',
                    handler: plugin.cancelEdit,
                    // text: rowEditor.cancelBtnText,
                    text: 'Cancelar',
                    listeners: {
                        element: 'el',
                        keydown: me.onCancelKeyDown,
                        scope: me
                    }
                }
            ]
        }, config);

        me.callParent([config]);

        me.addClsWithUI(me.position);
    }
});