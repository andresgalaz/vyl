#!/bin/bash 
RUTA=$(dirname $0)
if [ "$RUTA" != "." ] ; then
	cd "$RUTA"
fi
JAVA_SRC=$PWD/../../../../javaUnitDesap/src

diff -q $JAVA_SRC/vyl/db/Venta.java				$PWD/db/ventaClase.bsh 
diff -q $JAVA_SRC/vyl/db/VentaArchivos.java		$PWD/db/ventaArchivosClase.bsh 
diff -q $JAVA_SRC/vyl/db/Comprador.java			$PWD/db/compradorClase.bsh 
diff -q $JAVA_SRC/vyl/db/Empresa.java				$PWD/db/empresaClase.bsh 
diff -q $JAVA_SRC/vyl/db/Leasing.java				$PWD/db/leasingClase.bsh 
diff -q $JAVA_SRC/vyl/db/Loteo.java				$PWD/db/loteoClase.bsh 

diff -q $JAVA_SRC/vyl/report/Formulario.java		$PWD/report/formularioClase.bsh 
diff -q $JAVA_SRC/vyl/report/Escritura.java		$PWD/report/escrituraClase.bsh 
diff -q $JAVA_SRC/vyl/report/Instrucciones.java	$PWD/report/instruccionesClase.bsh 

# diff -q $JAVA_SRC/util/JasperUtil.java			$PWD/util/jasperUtilClase.bsh
# diff -q $JAVA_SRC/util/Rut.java					$PWD/util/rutClase.bsh 
diff -q $JAVA_SRC/util/ReportUtil.java				$PWD/util/reportUtilClase.bsh
diff -q $JAVA_SRC/prg/glz/wkf/RolFuncion.java		$PWD/wkf/rolFuncionClase.bsh 
