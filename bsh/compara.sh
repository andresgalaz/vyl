#!/bin/bash -x
RUTA=$(dirname $0)
if [ "$RUTA" != "." ] ; then
	cd "$RUTA"
fi
JAVA_SRC=$PWD/../../../../javaUnitDesap/src

diff $JAVA_SRC/vyl/db/Venta.java			$PWD/db/ventaClase.bsh 
diff $JAVA_SRC/vyl/db/VentaArchivos.java	$PWD/db/ventaArchivosClase.bsh 
diff $JAVA_SRC/vyl/db/Comprador.java		$PWD/db/compradorClase.bsh 
diff $JAVA_SRC/vyl/db/Empresa.java			$PWD/db/empresaClase.bsh 
diff $JAVA_SRC/vyl/db/Leasing.java			$PWD/db/leasingClase.bsh 
diff $JAVA_SRC/vyl/db/Loteo.java			$PWD/db/loteoClase.bsh 

diff $JAVA_SRC/vyl/report/Formulario.java	$PWD/report/formularioClase.bsh 
diff $JAVA_SRC/vyl/report/Escritura.java	$PWD/report/escrituraClase.bsh 

diff $JAVA_SRC/util/JasperUtil.java			$PWD/util/jasperUtilClase.bsh
# diff $JAVA_SRC/util/Rut.java				$PWD/util/rutClase.bsh 
diff $JAVA_SRC/prg/glz/wkf/RolFuncion.java	$PWD/wkf/rolFuncionClase.bsh 
