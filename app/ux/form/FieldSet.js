Ext.define('vyl.ux.form.FieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.wkfFieldSet',
    xtype: 'wkffieldset',

    invalidMsg: 'Campo inválido',
    valid: true,
    // allowBlank: true,
    tooltip: null,

    defaults: {
        anchor: '100%'
    },

    listeners: {
        focusleave: {
            fn: function (fld, ev, opts) {
                this.isValid();
            }
        },
        activate: {
            fn: function (fld, ev, opts) {
                this.isValid();
            }
        }
    },

    initComponent: function () {
        var me = this;
        this.callParent();

        if (me.invalidMsg) {
            me.setInvalidMsg(me.invalidMsg);
        }

        me.setValid(me.valid);
    },

    validaItems: function (arrItems, valor) {
        var me = this,
            valido = valor;

        arrItems.forEach(function (item) {
            if (item.xtype !== 'container') {
                if (item.submitValue) {
                    if (!item.isValid())
                        valido = false;
                }
            } else {
                valido = me.validaItems(item.items.items, valido);
            }
        });

        if (valido == undefined) {
            valido = true;
        }

        return valido;
    },

    isValid: function () {
        var me = this
        valido = true;

        valido = me.validaItems(me.items.items);

        me.setValid(valido);

        return valido;
    },

    reset: function () {
        var me = this;

        me.setValid(true);
    },

    setInvalidMsg: function (msg) {
        this.invalidMsg = msg;
    },

    setTooltip: function (obj) {
        this.tooltip = obj;
    },

    setValid: function (value) {
        var me = this;

        me.valid = value;

        if (!me.valid) {
            if (me.removeCls && me.addCls) {
                me.setStyle({
                    border: '1px solid red'
                });
            }

            if (me.invalidMsg && !me.tooltip) {
                var tooltip = Ext.create({
                    xtype: 'tooltip',
                    itemId: 'tlt' + me.getId(),
                    target: me,
                    html: me.invalidMsg,
                    trackMouse: true,
                });

                me.tooltip = tooltip;
            }
        } else {
            if (me.removeCls && me.addCls) {
                me.setStyle({
                    border: '1px solid #c2c2c2'
                });
            }

            if (me.tooltip) {
                me.tooltip.destroy();
                me.tooltip = null;
            }
        }
    }
});