Ext.define('vyl.view.admin.loteo.LoteoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loteo',

    init: function () {
        var me = this;

        me.defaultToken = Ext.getApplication().getDefaultToken();
        me.msgTitle = 'VYL - Loteo';
    },

    actualizar: function () {
        var me = this,
            vm = me.getViewModel(),
            stListaLoteo = vm.getStore('stListaLoteo');

        stListaLoteo.load();
    },

    borrarFormulario: function () {
        var me = this,
            refs = me.getReferences(),
            frmLoteo = refs.frmAbmLoteo,
            arrFields = frmLoteo.query("field{submitValue==true}");

        frmLoteo.reset();

        // console.log('[cargarLoteo] arrFields', arrFields);
        arrFields.forEach(function (fld) {
            if (fld.isVisible()) {
                fld.setReadOnly(false);
            }
        });
    },

    cargarLoteo: function (loteo_id) {
        var me = this,
            refs = me.getReferences(),
            frmLoteo = refs.frmAbmLoteo;

        me.borrarFormulario();

        if (loteo_id > 0) {
            Ext.Ajax.request({
                url: '../do/vyl/bsh/loteoGet.bsh',
                params: {
                    prm_dataSource: 'vylDS',
                    prm_pLoteo: loteo_id
                },

                success: function (response, opts) {
                    var rta = JSON.parse(response.responseText),
                        data = Ext.create('vyl.model.Base');

                    if (rta.success) {
                        refs.tabPrincipal.setActiveTab(1);

                        data.set(rta);
                        frmLoteo.loadRecord(data);

                        var arrFields = frmLoteo.query("field{submitValue==true}");
                        // console.log('[cargarLoteo] arrFields', arrFields);
                        arrFields.forEach(function (fld) {
                            if (fld.isVisible()) {
                                fld.setReadOnly(false);
                            }
                        });
                    } else {
                        Ext.Msg.show({
                            title: me.msgTitle,
                            message: response.responseText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });
                    }
                },
                failure: function (response, opts) {
                    console.error('[resolverTarea] Error en llamada : ' + response.status);
                    Ext.Msg.show({
                        title: me.msgTitle,
                        message: response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
        }
    },

    salir: function () {
        var me = this;

        me.borrarFormulario();
        me.redirectTo(me.defaultToken);
    },

    onAccionAbm: function (btn, e, opts) {
        var me = this,
            refs = me.getReferences(),
            frmAbmLoteo = refs.frmAbmLoteo,
            view = me.getView(),
            datos = {},
            btnName = btn.name;

        // Genera json con datos de la solicitud
        datos = frmAbmLoteo.getValues();

        if (DEBUG) console.log('[onAccionAbm] datos', datos);

        switch (btnName) {
            case 'salir':
                me.salir();
                break;

            case 'nuevo':
                me.borrarFormulario();
                break;

            case 'grabar':
                if (frmAbmLoteo.isValid()) {
                    view.mask('Grabando datos');

                    Ext.Ajax.request({
                        url: '../do/vyl/bsh/loteoInsUpd.bsh',
                        method: 'POST',
                        params: {
                            prm_dataSource: 'vylDS',
                            prm_data: JSON.stringify(datos)
                        },

                        success: function (response, opts) {
                            var resp = Ext.decode(response.responseText);
                            view.unmask();

                            if (!resp.success) {
                                console.error('[onAccionAbm] Error loteoInsUpd.bsh', response);
                                Ext.Msg.show({
                                    title: me.msgTitle,
                                    message: response.responseText,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });

                            } else {
                                Ext.Msg.show({
                                    title: me.msgTitle,
                                    message: 'Loteo grabado con éxito',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO,
                                });

                                me.borrarFormulario();
                            }
                        },

                        failure: function (response, opts) {
                            view.unmask();

                            console.error('[onAccionAbm] Error en llamada loteoInsUpd.bsh: ' + response.status);
                            Ext.Msg.show({
                                title: 'Error Inesperado',
                                message: response.responseText,
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                        }
                    });
                } else {
                    Ext.Msg.show({
                        title: me.msgTitle,
                        message: 'Existen campos inválidos. Por favor verifique solicitud.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING,
                    });
                }

                break;

        }
    },

    onActivateGrillaLista: function () {
        this.actualizar();
    },

    onActivateAbmLoteo: function () {
        this.borrarFormulario();
    },

    onCargarRegistro: function (grid, rowIndex, colIndex) {
        var me = this,
            rec = grid.getStore().getAt(rowIndex);

        me.cargarLoteo(rec.data.LOTEO_ID);
    },

    onDblClickGrillaLista: function (grid, record, item, rowIndex, eOpts) {
        this.onCargarRegistro(grid, rowIndex);
    },

    onLoadStLoteo: function (st, records, successful, operation, eOpts) {
        var me = this,
            grid = me.getView(),
            stListaLoteoLocal = me.getViewModel().getStore('stListaLoteoLocal');

        stListaLoteoLocal.getProxy().setData(st.getRange());
        stListaLoteoLocal.load();
    },

    onRefrescar: function () {
        this.actualizar();
    }
});