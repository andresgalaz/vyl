#!/bin/bash -x
JAVA_SRC=$HOME/workspace/javaUnitDesap/src

diff $JAVA_SRC/vyl/db/Venta.java		db/ventaClase.bsh 
diff $JAVA_SRC/vyl/db/Comprador.java	db/compradorClase.bsh 
diff $JAVA_SRC/vyl/db/Empresa.java		db/empresaClase.bsh 
diff $JAVA_SRC/vyl/db/Loteo.java		db/loteoClase.bsh 
diff $JAVA_SRC/util/JsonDataUtil.java	util/jsonDataUtilClase.bsh
diff $JAVA_SRC/util/Rut.java			util/rutClase.bsh 
