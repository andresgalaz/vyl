var oGen = oGen || {};

/**
 * Se convierte los pares: Á por A, É por E, ...
 * @param {Caracteres con acentos} c 
 */
oGen.fnSacaAcentos = function(c){
    if(!c)
        return c;
    return c.replaceAll(/Á/g,'A').replaceAll(/É/g,'E').replaceAll(/Í/g,'I').replaceAll(/Ó/g,'O').replaceAll(/Ú/g,'U').replaceAll(/Ü/g,'U')
            .replaceAll(/á/g,'a').replaceAll(/é/g,'e').replaceAll(/í/g,'i').replaceAll(/ó/g,'o').replaceAll(/ú/g,'u').replaceAll(/ü/g,'u')
            .replaceAll(/Ñ/g,'N').replaceAll(/ñ/g,'n');
}
