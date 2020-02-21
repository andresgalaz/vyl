drop view if exists vLeasingResumen;
CREATE VIEW vLeasingResumen AS
    SELECT 
        pVenta AS pVenta,
        SUM(CASE WHEN ISNULL(dPago) THEN 0
            ELSE 1 END)						AS nCuotasPagadas,
        SUM(CASE WHEN ISNULL(dPago) THEN 0
            ELSE nMonto END)				AS nMontoPagado,
        SUM(CASE WHEN dVencimiento < NOW() AND ISNULL(dPago) THEN 1
            ELSE 0 END)						AS nCuotasAtrasadas,
        SUM(CASE WHEN dVencimiento < NOW() AND ISNULL(dPago) THEN nMonto
            ELSE 0 END)						AS nMontoAtrasado,
        SUM(CASE WHEN ISNULL(dPago) THEN nMonto
            ELSE 0 END)						AS nMontoRestante,
        MIN(dVencimiento)					AS dPrimeraCuota,
        MAX(dPago)							AS dUltimoPago
    FROM
        tLeasing
    GROUP BY pVenta