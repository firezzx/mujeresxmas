-- Las administradoras editan los planes desde el panel. Todo el mundo los puede seguir leyendo.

alter table public.plans
  add constraint plans_price_not_negative check (price_ars >= 0);

create policy "Administradoras editan planes"
  on public.plans for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
