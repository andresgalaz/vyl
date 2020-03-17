Ext.define('vyl.ux.window.MotivoRechazoController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.motivorechazo',

    init: function() {
        var me = this;
    },
    onAceptar: function() {
        var me = this,
            view = me.getView();

        view.close();
    },

    onAfterRender: function(wnd, eOpts) {
        var me = this,
            view = me.getView(),
            refs = view.getReferences();

        if (view.getIngresaMotivo()) {
            // Wnd modo ingresa motivo
            refs.btnAceptar.setHidden(true);
            refs.btnCancelar.setHidden(false);
            refs.btnFinalizar.setHidden(false);

            refs.txaRechazo.setDisabled(false);
        } else {
            // Wnd modo muestra motivo
            refs.btnAceptar.setHidden(false);
            refs.btnCancelar.setHidden(true);
            refs.btnFinalizar.setHidden(true);

            refs.txaRechazo.setDisabled(true);
        }
    },

    onCancelar: function() {
        var me = this,
            view = me.getView();

        view.fireEvent('cancelar');
        view.destroy();
    },

    onGrabar: function() {
        var me = this,
            view = me.getView(),
            motivo = view.getReferences().txaRechazo.getValue();

        if (motivo) {
            view.fireEvent('grabar', motivo);
            view.destroy();
        } else {
            Ext.Msg.show({
                title: view.getTitle(),
                message: 'Debe ingresar un motivo de rechazo para continuar con la acción',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING,
            });
        }
    }
});