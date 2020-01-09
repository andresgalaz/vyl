Ext.define('vyl.view.ventas.cierre.VentasCierreViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ventasciere',

    data: {
        formularioId: 0,
        rutComprador: '',
        valorPredio: 0,
        valorReserva: 0,
        valorContado: 0,
        cuotas: 0,
        interes: 0
    },

    formulas: {
        getSaldo: function(get) {
            var me = this,
                valorPredio = get('valorPredio'),
                valorReserva = get('valorReserva');

            if (valorPredio > 0 && valorReserva >= 0 && valorPredio >= valorReserva) {
                return valorPredio - valorReserva;
            
            } else {
                return null
            }
        },
        getFinanciamiento: function(get) {
            var me = this,
                valorPredio = get('valorPredio'),
                valorReserva = get('valorReserva'),
                valorContado = get('valorContado');

            if (valorPredio > 0 && valorReserva >= 0 && valorContado >= 0 && valorPredio >= valorReserva + valorContado) {
                return valorPredio - valorReserva - valorContado;
            
            } else {
                return null
            }
        },
        getValorCuota: function(get) {
            var me = this,
                cuotas = get('cuotas'),
                finan = get('getFinanciamiento'),
                interes = get('interes'),
                tasa = 0;

            if (cuotas == 1) 
                return finan;

            if (cuotas > 1 && finan > 0 ) {
                var tasa = interes > 0 ? cuotas * interes / 12 : 0,
                    total = finan * tasa / 100 + finan;
                    
                return Ext.Number.roundToPrecision(total/cuotas, 2);
            }
        }
    },

    stores: {
        stEmpresas: {
            idProperty: 'EMPRESA_ID',

            fields: [
                { name: 'EMPRESA_ID', type: 'int' },
                { name: 'EMPRESA_NOMBRE', type: 'string' },
                { name: 'EMPRESA_REPRESENTANTE', type: 'string' },
                { name: 'EMPRESA_RUT', type: 'string' },
                { name: 'EMPRESA_RUT_REPRESENTANTE', type: 'string' },
            ],

            proxy: {
                url : '../do/vyl/bsh/lisEmpresa.bsh',
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                extraParams: {
                    prm_dataSource: 'vylDS'
                }
            },

            autoLoad: true
        },

        stEstadoCivil: {
            fields: ['COD', 'ESTADO'],

            data: [
                {COD: 'soltero',        ESTADO: 'Soltera/o'},
                {COD: 'casado',         ESTADO: 'Casada/o'},
                {COD: 'divorciado',     ESTADO: 'Divorciada/o'},
                {COD: 'viudo',          ESTADO: 'Viuda/o'}
            ]
        },

        stFormulariosIngresados: {
            fields: [
            ],

            proxy: {
                url: '',
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                extraParams: {
                    prm_dataSource: 'vylDS'
                }
            },

            autoLoad: false,

            listeners: {
                load: 'onLoadStFormulariosIngresados'
            }
        },

        stFormulariosIngresadosLocal: {
            fields: [
            ],

            proxy: {
                type: 'memory',
                enablePaging: true,
                reader: {
                    rootProperty: 'records',
                    totalProperty: 'count'
                }
            },

            pageSize: 25
        },

        stModalidadPago: {
            fields: ['COD', 'MODALIDAD'],

            data: [
                {COD: 'vale_vista', MODALIDAD: 'Vale Vista'},
            ]
        },

        stModalidadVenta: {
            fields: ['COD', 'MODALIDAD'],

            data: [
                {COD: 'directa', MODALIDAD: 'Venta al Contado'},
                {COD: 'financiamiento', MODALIDAD: 'Venta con Financiamiento'},
            ]
        },

        stNacionalidad: {
            fields: ['COD', 'NACIONALIDAD'],
            
            data: [
                {COD: 'chile',           NACIONALIDAD: 'Chilena'},
                {COD: 'argentina',       NACIONALIDAD: 'Argentina'},
                {COD: 'bolivia',         NACIONALIDAD: 'Boliviana'},
                {COD: 'brasil',          NACIONALIDAD: 'Brasileña'},
                {COD: 'colombia',        NACIONALIDAD: 'Colombiana'},
                {COD: 'ecuador',         NACIONALIDAD: 'Ecuatoriana'},
                {COD: 'paraguay',        NACIONALIDAD: 'Paraguaya'},
                {COD: 'peru',            NACIONALIDAD: 'Peruana'},
                {COD: 'uruguay',         NACIONALIDAD: 'Uruguaya'},
                {COD: 'venezuela',       NACIONALIDAD: 'Venezolana'},
                {COD: '-',               NACIONALIDAD: '_______________'},
                {COD: 'afganistán' ,NACIONALIDAD: 'Afganistán'},
                {COD: 'albania' ,NACIONALIDAD: 'Albania'},
                {COD: 'alemania' ,NACIONALIDAD: 'Alemania'},
                {COD: 'andorra' ,NACIONALIDAD: 'Andorra'},
                {COD: 'angola' ,NACIONALIDAD: 'Angola'},
                {COD: 'antigua y barbuda' ,NACIONALIDAD: 'Antigua y Barbuda'},
                {COD: 'arabia saudita' ,NACIONALIDAD: 'Arabia Saudita'},
                {COD: 'argelia' ,NACIONALIDAD: 'Argelia'},
                {COD: 'armenia' ,NACIONALIDAD: 'Armenia'},
                {COD: 'australia' ,NACIONALIDAD: 'Australia'},
                {COD: 'austria' ,NACIONALIDAD: 'Austria'},
                {COD: 'azerbaiyán' ,NACIONALIDAD: 'Azerbaiyán'},
                {COD: 'bahamas' ,NACIONALIDAD: 'Bahamas'},
                {COD: 'bangladés' ,NACIONALIDAD: 'Bangladés'},
                {COD: 'barbados' ,NACIONALIDAD: 'Barbados'},
                {COD: 'baréin' ,NACIONALIDAD: 'Baréin'},
                {COD: 'bélgica' ,NACIONALIDAD: 'Bélgica'},
                {COD: 'belice' ,NACIONALIDAD: 'Belice'},
                {COD: 'benín' ,NACIONALIDAD: 'Benín'},
                {COD: 'bielorrusia' ,NACIONALIDAD: 'Bielorrusia'},
                {COD: 'birmania' ,NACIONALIDAD: 'Birmania'},
                {COD: 'bosnia y herzegovina' ,NACIONALIDAD: 'Bosnia y Herzegovina'},
                {COD: 'botsuana' ,NACIONALIDAD: 'Botsuana'},
                {COD: 'brunéi' ,NACIONALIDAD: 'Brunéi'},
                {COD: 'bulgaria' ,NACIONALIDAD: 'Bulgaria'},
                {COD: 'burkina faso' ,NACIONALIDAD: 'Burkina Faso'},
                {COD: 'burundi' ,NACIONALIDAD: 'Burundi'},
                {COD: 'bután' ,NACIONALIDAD: 'Bután'},
                {COD: 'cabo verde' ,NACIONALIDAD: 'Cabo Verde'},
                {COD: 'camboya' ,NACIONALIDAD: 'Camboya'},
                {COD: 'camerún' ,NACIONALIDAD: 'Camerún'},
                {COD: 'canadá' ,NACIONALIDAD: 'Canadá'},
                {COD: 'catar' ,NACIONALIDAD: 'Catar'},
                {COD: 'chad' ,NACIONALIDAD: 'Chad'},
                {COD: 'china' ,NACIONALIDAD: 'China'},
                {COD: 'chipre' ,NACIONALIDAD: 'Chipre'},
                {COD: 'ciudad del vaticano' ,NACIONALIDAD: 'Ciudad del Vaticano'},
                {COD: 'comoras' ,NACIONALIDAD: 'Comoras'},
                {COD: 'corea del norte' ,NACIONALIDAD: 'Corea del Norte'},
                {COD: 'corea del sur' ,NACIONALIDAD: 'Corea del Sur'},
                {COD: 'costa de marfil' ,NACIONALIDAD: 'Costa de Marfil'},
                {COD: 'costa rica' ,NACIONALIDAD: 'Costa Rica'},
                {COD: 'croacia' ,NACIONALIDAD: 'Croacia'},
                {COD: 'cuba' ,NACIONALIDAD: 'Cuba'},
                {COD: 'dinamarca' ,NACIONALIDAD: 'Dinamarca'},
                {COD: 'dominica' ,NACIONALIDAD: 'Dominica'},
                {COD: 'egipto' ,NACIONALIDAD: 'Egipto'},
                {COD: 'el salvador' ,NACIONALIDAD: 'El Salvador'},
                {COD: 'eau' ,NACIONALIDAD: 'Emiratos Árabes Unidos'},
                {COD: 'eritrea' ,NACIONALIDAD: 'Eritrea'},
                {COD: 'eslovaquia' ,NACIONALIDAD: 'Eslovaquia'},
                {COD: 'eslovenia' ,NACIONALIDAD: 'Eslovenia'},
                {COD: 'españa' ,NACIONALIDAD: 'España'},
                {COD: 'estados unidos' ,NACIONALIDAD: 'Estados Unidos'},
                {COD: 'estonia' ,NACIONALIDAD: 'Estonia'},
                {COD: 'etiopía' ,NACIONALIDAD: 'Etiopía'},
                {COD: 'filipinas' ,NACIONALIDAD: 'Filipinas'},
                {COD: 'finlandia' ,NACIONALIDAD: 'Finlandia'},
                {COD: 'fiyi' ,NACIONALIDAD: 'Fiyi'},
                {COD: 'francia' ,NACIONALIDAD: 'Francia'},
                {COD: 'gabón' ,NACIONALIDAD: 'Gabón'},
                {COD: 'gambia' ,NACIONALIDAD: 'Gambia'},
                {COD: 'georgia' ,NACIONALIDAD: 'Georgia'},
                {COD: 'ghana' ,NACIONALIDAD: 'Ghana'},
                {COD: 'granada' ,NACIONALIDAD: 'Granada'},
                {COD: 'grecia' ,NACIONALIDAD: 'Grecia'},
                {COD: 'guatemala' ,NACIONALIDAD: 'Guatemala'},
                {COD: 'guyana' ,NACIONALIDAD: 'Guyana'},
                {COD: 'guinea' ,NACIONALIDAD: 'Guinea'},
                {COD: 'guinea ecuatorial' ,NACIONALIDAD: 'Guinea ecuatorial'},
                {COD: 'guinea-bisáu' ,NACIONALIDAD: 'Guinea-Bisáu'},
                {COD: 'haití' ,NACIONALIDAD: 'Haití'},
                {COD: 'honduras' ,NACIONALIDAD: 'Honduras'},
                {COD: 'hungría' ,NACIONALIDAD: 'Hungría'},
                {COD: 'india' ,NACIONALIDAD: 'India'},
                {COD: 'indonesia' ,NACIONALIDAD: 'Indonesia'},
                {COD: 'irak' ,NACIONALIDAD: 'Irak'},
                {COD: 'irán' ,NACIONALIDAD: 'Irán'},
                {COD: 'irlanda' ,NACIONALIDAD: 'Irlanda'},
                {COD: 'islandia' ,NACIONALIDAD: 'Islandia'},
                {COD: 'islas marshall' ,NACIONALIDAD: 'Islas Marshall'},
                {COD: 'islas salomón' ,NACIONALIDAD: 'Islas Salomón'},
                {COD: 'israel' ,NACIONALIDAD: 'Israel'},
                {COD: 'italia' ,NACIONALIDAD: 'Italia'},
                {COD: 'jamaica' ,NACIONALIDAD: 'Jamaica'},
                {COD: 'japón' ,NACIONALIDAD: 'Japón'},
                {COD: 'jordania' ,NACIONALIDAD: 'Jordania'},
                {COD: 'kazajistán' ,NACIONALIDAD: 'Kazajistán'},
                {COD: 'kenia' ,NACIONALIDAD: 'Kenia'},
                {COD: 'kirguistán' ,NACIONALIDAD: 'Kirguistán'},
                {COD: 'kiribati' ,NACIONALIDAD: 'Kiribati'},
                {COD: 'kuwait' ,NACIONALIDAD: 'Kuwait'},
                {COD: 'laos' ,NACIONALIDAD: 'Laos'},
                {COD: 'lesoto' ,NACIONALIDAD: 'Lesoto'},
                {COD: 'letonia' ,NACIONALIDAD: 'Letonia'},
                {COD: 'líbano' ,NACIONALIDAD: 'Líbano'},
                {COD: 'liberia' ,NACIONALIDAD: 'Liberia'},
                {COD: 'libia' ,NACIONALIDAD: 'Libia'},
                {COD: 'liechtenstein' ,NACIONALIDAD: 'Liechtenstein'},
                {COD: 'lituania' ,NACIONALIDAD: 'Lituania'},
                {COD: 'luxemburgo' ,NACIONALIDAD: 'Luxemburgo'},
                {COD: 'madagascar' ,NACIONALIDAD: 'Madagascar'},
                {COD: 'malasia' ,NACIONALIDAD: 'Malasia'},
                {COD: 'malaui' ,NACIONALIDAD: 'Malaui'},
                {COD: 'maldivas' ,NACIONALIDAD: 'Maldivas'},
                {COD: 'malí' ,NACIONALIDAD: 'Malí'},
                {COD: 'malta' ,NACIONALIDAD: 'Malta'},
                {COD: 'marruecos' ,NACIONALIDAD: 'Marruecos'},
                {COD: 'mauricio' ,NACIONALIDAD: 'Mauricio'},
                {COD: 'mauritania' ,NACIONALIDAD: 'Mauritania'},
                {COD: 'méxico' ,NACIONALIDAD: 'México'},
                {COD: 'micronesia' ,NACIONALIDAD: 'Micronesia'},
                {COD: 'moldavia' ,NACIONALIDAD: 'Moldavia'},
                {COD: 'mónaco' ,NACIONALIDAD: 'Mónaco'},
                {COD: 'mongolia' ,NACIONALIDAD: 'Mongolia'},
                {COD: 'montenegro' ,NACIONALIDAD: 'Montenegro'},
                {COD: 'mozambique' ,NACIONALIDAD: 'Mozambique'},
                {COD: 'namibia' ,NACIONALIDAD: 'Namibia'},
                {COD: 'nauru' ,NACIONALIDAD: 'Nauru'},
                {COD: 'nepal' ,NACIONALIDAD: 'Nepal'},
                {COD: 'nicaragua' ,NACIONALIDAD: 'Nicaragua'},
                {COD: 'níger' ,NACIONALIDAD: 'Níger'},
                {COD: 'nigeria' ,NACIONALIDAD: 'Nigeria'},
                {COD: 'noruega' ,NACIONALIDAD: 'Noruega'},
                {COD: 'nueva zelanda' ,NACIONALIDAD: 'Nueva Zelanda'},
                {COD: 'omán' ,NACIONALIDAD: 'Omán'},
                {COD: 'países bajos' ,NACIONALIDAD: 'Países Bajos'},
                {COD: 'pakistán' ,NACIONALIDAD: 'Pakistán'},
                {COD: 'palaos' ,NACIONALIDAD: 'Palaos'},
                {COD: 'panamá' ,NACIONALIDAD: 'Panamá'},
                {COD: 'papúa nueva guinea' ,NACIONALIDAD: 'Papúa Nueva Guinea'},
                {COD: 'polonia' ,NACIONALIDAD: 'Polonia'},
                {COD: 'portugal' ,NACIONALIDAD: 'Portugal'},
                {COD: 'reino unido' ,NACIONALIDAD: 'Reino Unido'},
                {COD: 'república centroafricana' ,NACIONALIDAD: 'República Centroafricana'},
                {COD: 'república checa' ,NACIONALIDAD: 'República Checa'},
                {COD: 'república de macedonia' ,NACIONALIDAD: 'República de Macedonia'},
                {COD: 'república del congo' ,NACIONALIDAD: 'República del Congo'},
                {COD: 'república democrática del congo' ,NACIONALIDAD: 'República Democrática del Congo'},
                {COD: 'república dominicana' ,NACIONALIDAD: 'República Dominicana'},
                {COD: 'república sudafricana' ,NACIONALIDAD: 'República Sudafricana'},
                {COD: 'ruanda' ,NACIONALIDAD: 'Ruanda'},
                {COD: 'rumanía' ,NACIONALIDAD: 'Rumanía'},
                {COD: 'rusia' ,NACIONALIDAD: 'Rusia'},
                {COD: 'samoa' ,NACIONALIDAD: 'Samoa'},
                {COD: 'san cristóbal y nieves' ,NACIONALIDAD: 'San Cristóbal y Nieves'},
                {COD: 'san marino' ,NACIONALIDAD: 'San Marino'},
                {COD: 'san vicente y las granadinas' ,NACIONALIDAD: 'San Vicente y las Granadinas'},
                {COD: 'santa lucía' ,NACIONALIDAD: 'Santa Lucía'},
                {COD: 'santo tomé y príncipe' ,NACIONALIDAD: 'Santo Tomé y Príncipe'},
                {COD: 'senegal' ,NACIONALIDAD: 'Senegal'},
                {COD: 'serbia' ,NACIONALIDAD: 'Serbia'},
                {COD: 'seychelles' ,NACIONALIDAD: 'Seychelles'},
                {COD: 'sierra leona' ,NACIONALIDAD: 'Sierra Leona'},
                {COD: 'singapur' ,NACIONALIDAD: 'Singapur'},
                {COD: 'siria' ,NACIONALIDAD: 'Siria'},
                {COD: 'somalia' ,NACIONALIDAD: 'Somalia'},
                {COD: 'sri lanka' ,NACIONALIDAD: 'Sri Lanka'},
                {COD: 'suazilandia' ,NACIONALIDAD: 'Suazilandia'},
                {COD: 'sudán' ,NACIONALIDAD: 'Sudán'},
                {COD: 'sudán del sur' ,NACIONALIDAD: 'Sudán del Sur'},
                {COD: 'suecia' ,NACIONALIDAD: 'Suecia'},
                {COD: 'suiza' ,NACIONALIDAD: 'Suiza'},
                {COD: 'surinam' ,NACIONALIDAD: 'Surinam'},
                {COD: 'tailandia' ,NACIONALIDAD: 'Tailandia'},
                {COD: 'tanzania' ,NACIONALIDAD: 'Tanzania'},
                {COD: 'tayikistán' ,NACIONALIDAD: 'Tayikistán'},
                {COD: 'timor oriental' ,NACIONALIDAD: 'Timor Oriental'},
                {COD: 'togo' ,NACIONALIDAD: 'Togo'},
                {COD: 'tonga' ,NACIONALIDAD: 'Tonga'},
                {COD: 'trinidad y tobago' ,NACIONALIDAD: 'Trinidad y Tobago'},
                {COD: 'túnez' ,NACIONALIDAD: 'Túnez'},
                {COD: 'turkmenistán' ,NACIONALIDAD: 'Turkmenistán'},
                {COD: 'turquía' ,NACIONALIDAD: 'Turquía'},
                {COD: 'tuvalu' ,NACIONALIDAD: 'Tuvalu'},
                {COD: 'ucrania' ,NACIONALIDAD: 'Ucrania'},
                {COD: 'uganda' ,NACIONALIDAD: 'Uganda'},
                {COD: 'uzbekistán' ,NACIONALIDAD: 'Uzbekistán'},
                {COD: 'vanuatu' ,NACIONALIDAD: 'Vanuatu'},
                {COD: 'vietnam' ,NACIONALIDAD: 'Vietnam'},
                {COD: 'yemen' ,NACIONALIDAD: 'Yemen'},
                {COD: 'yibuti' ,NACIONALIDAD: 'Yibuti'},
                {COD: 'zambia' ,NACIONALIDAD: 'Zambia'},
                {COD: 'zimbabue' ,NACIONALIDAD: 'Zimbabue'},
            ]
        },
    }
});