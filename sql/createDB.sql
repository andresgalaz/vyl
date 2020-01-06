 DROP TABLE IF EXISTS tLeasing;
 DROP TABLE IF EXISTS tGastoVenta;
 DROP TABLE IF EXISTS tVenta;
 DROP TABLE IF EXISTS tEmpresa;
 DROP TABLE IF EXISTS tComprador;

CREATE TABLE tComprador (
  pComprador int(11) unsigned NOT NULL auto_increment,
  cNombre varchar(45) NOT NULL,
  cRut varchar(12) NOT NULL,
  cTelefono varchar(45) DEFAULT NULL,
  cNacionalidad varchar(45) DEFAULT NULL,
  cEmail varchar(45) DEFAULT NULL,
  cProfesion varchar(45) DEFAULT NULL,
  cDireccion varchar(80) DEFAULT NULL,
  cEstadoCivil varchar(20) DEFAULT NULL,
  PRIMARY KEY (pComprador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE tEmpresa (
  pEmpresa int(11) unsigned NOT NULL,
  cNombre varchar(45) NOT NULL,
  cRepresentante varchar(45) NOT NULL,
  cRutEmpresa varchar(12) NOT NULL,
  cRutRepresentante varchar(12) NOT NULL,
  PRIMARY KEY (pEmpresa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO tEmpresa (pEmpresa, cNombre, cRepresentante, cRutEmpresa, cRutRepresentante) 
VALUES (1, 'Inversiones AFT LAKUS LTDA', 'CARLOS HUGO GALAZ QUINTANA', '76.598.723-7', '7.894.048-4');

CREATE TABLE tVenta (
  pVenta int(11) unsigned NOT NULL auto_increment,
  fEvento int(11) unsigned NOT NULL,
  dCierre date NOT NULL,
  nParcela int(11) unsigned DEFAULT NULL,
  cLoteo varchar(45) DEFAULT NULL,
  cRol varchar(12) DEFAULT NULL,
  fEmpresa int(11) unsigned DEFAULT NULL,
  fComprador int(11) unsigned DEFAULT NULL,
  cJsonData json NOT NULL,
  bLeasing char(1) NOT NULL DEFAULT '0',
  nValor decimal(14,2) DEFAULT NULL,
  nReserva decimal(14,2) DEFAULT NULL,
  nPie decimal(14,2) DEFAULT NULL,
  nCuotas int(11) DEFAULT NULL,
  tCreacion datetime DEFAULT NULL,
  fUsrCreacion int(11) DEFAULT NULL,
  tModificacion datetime DEFAULT NULL,
  fUsrModificacion int(11) DEFAULT NULL,
  PRIMARY KEY (pVenta),
  CONSTRAINT fk_venta_comprador FOREIGN KEY (fComprador) REFERENCES tComprador (pComprador) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT fk_venta_empresa FOREIGN KEY (fEmpresa) REFERENCES tEmpresa (pEmpresa) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE tGastoVenta (
  pVenta int(11) unsigned NOT NULL,
  pGasto int(11) unsigned NOT NULL,
  cTipo varchar(45) NOT NULL,
  nMonto decimal(14,2) NOT NULL,
  dVencimiento date  DEFAULT NULL,
  dPago date DEFAULT NULL,
  bEstimado char(1) NOT NULL DEFAULT '0',
  bAdeudado char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (pVenta,pGasto),
  CONSTRAINT fk_gastoVenta_venta FOREIGN KEY (pVenta) REFERENCES tVenta (pVenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE tLeasing (
  pVenta int(11) unsigned NOT NULL,
  pCuota int(4) unsigned NOT NULL,
  nMonto decimal(14,2) NOT NULL,
  dVencimiento date NOT NULL,
  dPago date NOT NULL,
  PRIMARY KEY (pVenta,pCuota),
  CONSTRAINT fk_leasing_venta FOREIGN KEY (pVenta) REFERENCES tVenta (pVenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
