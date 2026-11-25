-- El plan Inicio es gratis: precio 0 (null se muestra como "A confirmar"). Corrige la migración
-- 20261125120000, que lo había dejado en null.
update public.plans set price_ars = 0 where id = 'gratis';
