Ext.define('vyl.view.ventas.cierre.VentasCierreController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ventasciere',

	requires: [
		'vyl.ux.window.MotivoRechazo'
	],

	init: function (view) {
		var me = this;

		me.titulo = 'Formulario Cierre Venta';
		me.cxnCtrl = Ext.getApplication().getController('Conexion');
	},

	formularioGrabar: function(btn, jsonData, borrarFormulario) {
		var me = this,
			refs = me.getReferences(),
			vm = me.getViewModel(),
			formularioId = vm.get('formularioId'),
			view = me.getView(),
			datos = {};
		
		datos = view.getValues();

		// Modifica nacionalidad
		if (datos.VYL_COMPRADOR_SEXO && datos.VYL_COMPRADOR_NACIONALIDAD) {
			var nacSelect = refs.cbNacionalidad.getSelection();

			if (datos.VYL_COMPRADOR_SEXO == 'femenino') {
				datos['VYL_COMPRADOR_NACIONALIDAD'] = nacSelect.get('COD_F') ? nacSelect.get('COD_F') : nacSelect.get('COD');
			} else {
				datos['VYL_COMPRADOR_NACIONALIDAD'] = nacSelect.get('COD_M') ? nacSelect.get('COD_M') : nacSelect.get('COD') ;
			}
		}

		if (formularioId == 0) {
			// Solicitud nueva
			if (view.getEvento() == 0) {
				// Crea el evento
				view.creaEvento(function callback() {
					// Ejecuta la accion
					jsonData['TOKEN'] = {};
					jsonData.TOKEN['url'] = 'ventas-cierre/' + view.getEvento();
					
					btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
						if (dataOut.success) {
							var evento = dataOut.dataWkf.eventoActual[0],
								etapa = dataOut.dataWkf.etapas[0];

							if (etapa.cNombre == 'ingresado') {
								// Se asgina a si mismo la tarea 
								me.reasignarFormulario(evento, me.cxnCtrl.getUsuarioId(), function() {
									if (borrarFormulario) {
										me.formularioReiniciar();
									}
		
									Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');
								});
							} else {
								if (borrarFormulario) {
									me.formularioReiniciar();
								}
	
								Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');
							}

						} else {
							console.error('[formularioGrabar] Error inesperado', resp);
							
							Ext.Msg.show({
								title: me.titulo,
								message: dataOut.message,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
					});
					
				}, me.cxnCtrl.getUsuarioId(), jsonData);

			} else {
				// Error evento <> 0, solicitud = 0
				console.error('[formularioGrabar] Error inesperado: WkfEvento ' + view.getEvento() + ' solicitud = 0');
				Ext.Msg.show({
					title: me.titulo,
					message: 'Error inesperado: Se reiniciará el formulario',
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});

				me.formularioReiniciar();
			}
		} else {
			// Solicitud creada
			jsonData['TOKEN'] = {};
			jsonData.TOKEN['url'] = 'ventas-cierre/' + view.getEvento();

			btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
				if (dataOut.success) {
					var evento = dataOut.dataWkf.eventoActual[0],
						etapa = dataOut.dataWkf.etapas[0];

					if (etapa.cNombre == 'ingresado') {
						// Se asgina a si mismo la tarea 
						me.reasignarFormulario(evento, me.cxnCtrl.getUsuarioId(), function() {
							if (borrarFormulario) {
								me.formularioReiniciar();
							}

							Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');
						});
					} else {
						if (borrarFormulario) {
							me.formularioReiniciar();
						}

						Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');
					}

				} else {
					console.error('[formularioGrabar] Error inesperado', resp);
					
					Ext.Msg.show({
						title: me.titulo,
						message: dataOut.message,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			});
		}
	},

	formularioHabilitar: function() {
		var me = this,
            refs = me.getReferences(),
			view = me.getView(),
			fields = view.getForm().getFields().items;
        
        // Determina si bloquea la solicitud
        if (['ingresado','inscripcion_cotiza','revision_leasing', 'revision_escritura'].indexOf(view.getEtapaActual()) > -1) {            
            // Campos liberados
            fields.forEach (function (field) {
                field.setReadOnly (false);
            });
        } else {
			// Campos bloqueados
            fields.forEach (function (field) {
                field.setReadOnly (true);
            });
        }
	},

	formularioLeer: function(eventoId) {
		// TODO: Agregar datos de rechazo para mostrar mensaje. Habra que modificar la clase Venta.getById
		var me = this,
			vm = me.getViewModel(),
			refs = me.getReferences(),
			flsArchivos = refs.flsArchivos,
			view = me.getView(),
			stArchivos = vm.getStore('stArchivos');

		me.formularioReiniciar();

		view.mask('Cargando Formulario');

		view.setEvento(eventoId);
		view.leeEvento(function(rta) {
			// Cargar formulario
			var formData = rta.dataFormulario ? rta.dataFormulario : null,
				etapa = rta.dataWkf.etapas[0];

			if (formData) {
				var registro = Ext.create('vyl.model.Base');

				registro.set(formData);
				view.loadRecord(registro);

				view.setTitle('Formulario Cierre de Venta - ' + etapa.cTitulo);

				formData.VYL_MODALIDAD_VENTA == 'financiamiento' ? refs.ctnFinanciamiento.setHidden(false) : refs.ctnFinanciamiento.setHidden(true);

				stArchivos.load({
					params: {
						prm_pVenta: formData.VYL_ID
					},
					callback: function(records, operation, success) {
						if (success) {
							records.length > 0 ? flsArchivos.setCollapsed(false) : flsArchivos.setCollapsed(true);
						}
					}
				});
			}

			if (etapa.cNombre == "ingresado") {
				var wkfBtnFinalizarLeas = view.query('[name^="finalizar_ingreso_leasing"]')[0],
					wkfBtnFinalizarCont = view.query('[name^="finalizar_ingreso_contado"]')[0];
				
				if (formData.VYL_MODALIDAD_VENTA == 'directa') {
					if (wkfBtnFinalizarLeas && wkfBtnFinalizarCont) {
						wkfBtnFinalizarLeas.setHidden(true);
						wkfBtnFinalizarCont.setHidden(false);
					}
				}

				if (formData.VYL_MODALIDAD_VENTA == 'financiamiento') {
					if (wkfBtnFinalizarLeas && wkfBtnFinalizarCont) {
						wkfBtnFinalizarLeas.setHidden(false);
						wkfBtnFinalizarCont.setHidden(true);
					}
				}
			}

			me.formularioHabilitar();

			view.unmask();
		});
	},

	formularioReiniciar: function() {
		var me = this,
			refs = me.getReferences();
			vm = me.getViewModel(),
			view = me.getView();
		
		view.resetForm();
		view.setEtapaActual('ingresado');
		view.setTitle('Formulario Cierre de Venta - Nuevo');

		refs.ctnFinanciamiento.setHidden(true);
		refs.ctnFinanciamientoGastos.setHidden(true);
		refs.flsArchivos.setCollapsed(true);
	},
	
	reasignarFormulario: function(evento, usuarioId, callback) {
		Ext.Ajax.request({
			url : '../do/wkfReasigna',
			method : 'POST',
			params : {
				prm_nEvento: evento.pEvento,
				prm_nSecuencia: evento.pSecuencia,
				prm_pUsuarioNuevo: usuarioId
			},
			success : function(response, opts) {
				var obj = Ext.decode(response.responseText);
				if (obj.success) {
					if (callback) 
						callback();

				} else {
					console.error('[reasignarFormulario] Error inesperado: ' + response.responseText);
					Ext.Msg.show({
						title: 'Error Inesperado',
						message: response.responseText,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			},
			failure : function(response, opts) {
				console.error('Falla del lado del servidor, código respuesta: ' + response.status);
				Ext.Msg.show({
					title: 'Error Inesperado',
					message: response.responseText,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	},

	salir: function() {
		var me = this,
			defaultToken = Ext.getApplication().getDefaultToken();

		me.formularioReiniciar();
		me.redirectTo(defaultToken);
	},

	onClienteBuscar: function(fld, event, eOpts) {
		var me = this,
			refs = me.getReferences(),
			view = me.getView(),
			vm = me.getViewModel(),
			frmComprador = refs.frmComprador,
			arrFldsComprador = view.query('[name^="VYL_COMPRADOR"]');
	
		// Valida RUT
		if (fld.isValid()) {
			// Verifica que el cliente exista
			var rut = fld.getValue();

			if (rut != vm.get('rutComprador')) {
				frmComprador.mask('Buscando comprador');

				Ext.Ajax.request({
					url: GLOBAL_HOST+'/do/vyl/bsh/getComprador.bsh',
				    cors: true, withCredentials: true, useDefaultXhrHeader: false,
					method : 'POST',
					params: {
						prm_dataSource: 'vylDS',
						prm_cRut: rut,
						prm_alias: 'VYL'
					},
					
					success : function(response, opts) {
						var resp = Ext.decode(response.responseText);
	
						if (resp.success) {
							console.log('[onClienteBuscar]', resp);
	
							arrFldsComprador.forEach(function(fld) {
								fld.setReadOnly(false);
							});
	
							if (resp.VYL_COMPRADOR_ID && resp.VYL_COMPRADOR_ID > 0) {
								// Carga el formulario
								var reg = Ext.create('vyl.model.Base');

								reg.set(resp);
								frmComprador.loadRecord(reg);

							} else {
								frmComprador.reset();
								fld.setValue(rut); // Vuelve a colocar el RUT
							}

							vm.set('rutComprador', rut);
	
						} else {
							console.error('[onClienteBuscar]', resp);
							Ext.Msg.show({
								title: me.titulo,
								message: resp.message,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
						
						frmComprador.unmask();
					},
					failure : function(response, opts) {
						var resp = Ext.decode(response.responseText);
						console.error('[onClienteBuscar] Falla del lado del servidor', response.responseText);
						
						frmComprador.unmask();
						Ext.Msg.show({
							title: me.titulo,
							message: resp.message,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						})
					}
				});
			}

		} else {
			fld.markInvalid('RUT ingresado es invalido');

			arrFldsComprador.forEach(function(f) {
				if (fld.name !== f.name) {
					f.setReadOnly(true);
					f.reset();
				}
			});

			vm.set('rutComprador', '');
		}
	},
	
	onConsultaActivate: function() {
		var me = this,
			vm = me.getViewModel(),
			view = me.getView(),
			stFormulariosIngresados = vm.getStore('stFormulariosIngresados');
		
		view.mask('Cargando Listado');

		stFormulariosIngresados.load({
			callback: function(records, operation, success) {
				if (success)
					view.unmask();
			}
		});
	},

	onConsultaRowDblClick: function(grid, record, element, rowIndex, e, eOpts) {
		var me = this,
			eventoId = record.get('WKF_EVENTO');

		if (eventoId > 0) {
			me.redirectTo('ventas-cierre/' + eventoId);
		
		} else {
			console.warn('[onConsultaRowDblClick] Evento invalido ' + eventoId, record);
		}
	},

	onConsultarFormulario: function(view, rowIdx, colIdx, item, e, record, row) {
		var me = this,
			eventoId = record.get('WKF_EVENTO');

		if (eventoId > 0) {
			me.redirectTo('ventas-cierre/' + eventoId);
		
		} else {
			console.warn('[onConsultarFormulario] Evento invalido ' + eventoId, record);
		}
	},

	onFormularioActivate: function() {
		var me = this,
			vm = me.getViewModel(),
			stLoteo = vm.getStore('stLoteo');

		stLoteo.reload();
	},

	onFormularioCargar: function(eventoId) {
		var me = this;

		if (eventoId > 0) {
			me.formularioLeer(eventoId);
		}	
	},

	onLoadStFormulariosIngresados: function(st, records, successful, operation, eOpts ) {
        var me = this,
			stLocal = me.getViewModel().getStore('stFormulariosIngresadosLocal');
        
		stLocal.getProxy().setData(st.getRange());
		stLocal.load();
	},
	
	onLoteoNuevo: function() {
		var me = this;

		me.redirectTo('admin-loteo/0');
	},

	onModalidadVentaSelect: function(cb, record, eOpts) {
		var me = this,
			refs = me.getReferences(),
			view = me.getView(),
			modalidadVenta = record.get('COD'),
			arrFldsFinanciamiento = view.query('[name^="VYL_FINANCIAMIENTO"]'),
			wkfBtnFinalizarLeas = view.query('[name^="finalizar_ingreso_leasing"]')[0],
			wkfBtnFinalizarCont = view.query('[name^="finalizar_ingreso_contado"]')[0];

		if (modalidadVenta == 'financiamiento') {
			// Leasing
			refs.ctnFinanciamiento.setHidden(false);
			refs.ctnFinanciamientoGastos.setHidden(false);

			arrFldsFinanciamiento.forEach(function(fld) {
				if (fld.setObligatorio) {
					fld.setObligatorio(true);
				}
			});

			if (wkfBtnFinalizarLeas && wkfBtnFinalizarCont) {
				wkfBtnFinalizarLeas.setHidden(false);
				wkfBtnFinalizarCont.setHidden(true);
			}

		} else {
			// Contado
			refs.ctnFinanciamiento.setHidden(true);
			refs.ctnFinanciamientoGastos.setHidden(true);

			arrFldsFinanciamiento.forEach(function(fld) {
				if (fld.setObligatorio) {
					fld.setObligatorio(false);
				}
			});

			if (wkfBtnFinalizarLeas && wkfBtnFinalizarCont) {
				wkfBtnFinalizarLeas.setHidden(true);
				wkfBtnFinalizarCont.setHidden(false);
			}
		}
	},

	onWkfAccion: function(btn, event, eOpts) {
		var me = this,
			accion = btn.name,
			view = me.getView(),
			jsonData = {};
	
		jsonData['DATOS'] = {};
		jsonData.DATOS['formIngreso'] = view.getValues();
		jsonData.DATOS['usuario'] = me.cxnCtrl.getUsuario();

		if (view.getEvento() > 0) {
			jsonData['TOKEN'] = {};
			jsonData.TOKEN['url'] = 'ventas-cierre/' + view.getEvento();
		}
		
		switch (accion) {
			case 'cancelar':
				if (view.getEvento() > 0) {
					btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
							me.formularioReiniciar();
							Ext.Msg.alert(me.titulo, 'Formulario cancelado con éxito.');
					});
				} else {
					me.formularioReiniciar();
					Ext.Msg.alert(me.titulo, 'Formulario cancelado con éxito.');
				}
				break;

			case 'grabar':
				me.formularioGrabar(btn, jsonData, true);
				break;

			case 'finalizar_ingreso_leasing':
			case 'finalizar_ingreso_contado':
			case 'finalizar_revision_leas':
			case 'finalizar_revision_conta':
				if (view.isValid()) {
					me.formularioGrabar(btn, jsonData, true);

				} else {
					// Campos invalidos
					Ext.Msg.show({
                        title: me.titulo,
                        message: 'Existen campos obligatorios de completar vacios o inválidos.<br>Por favor verificar formulario',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING,
                    });
				}
				break;
			
			case 'cotizacion_finalizar':
				// TODO: Consultar que valores son obligatorios en este punto
				break;

			case 'salir':
				me.salir();
				break;

			case 'nuevo':
				me.formularioReiniciar();
				break;

			case 'venta_leas_autoriza':
			case 'venta_leas_rechaza':
			case 'escritura_autoriza':
			case 'escritura_rechaza':
				if (btn.getXType() == 'wkfaccionbutton' && btn.getBRechaza()) {
					// Solicita motivo de la cancelacion
					var wndRechazo = Ext.create({
						xtype: 'wndmotivorechazo',
						title: 'Formulario Venta Rechazado',
						ingresaMotivo: true
					}).show();
		
					wndRechazo.on("grabar", function(motivo) {
						// Agrega motivo de rechazo al json
						jsonData.DATOS['rechazo'] = {};
						jsonData.DATOS.rechazo['cMotivo'] = motivo; 
						jsonData.DATOS.rechazo['cUsuarioNombre'] = me.cxnCtrl.getUsuarioNombre();
						jsonData.DATOS.rechazo['dFecha'] = new Date().toJSON();

						btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
							Ext.Msg.alert(me.titulo, 'Formulario de Venta rechazado con éxito.');
								
							me.salir();
						});
					}, this);
		
					wndRechazo.on("cancelar", function(){
						return;
					}, this);

				} else {
					btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
						// if (DEBUG) console.log('[onWkfAccion] btn.ejecutaAcciones', dataOut);
						Ext.Msg.alert(me.titulo, 'Formulario de Venta autorizado con éxito.');
						me.salir();
					});
				}

				break;
			
			default:
				console.error('[onWkfAccion] Accion sin implementar: ' + accion);
				Ext.Msg.alert(me.titulo, 'Accion sin implementar');
				break;
		}
	}
});
