-- Nexora AI — CRM lead status values

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (
    status in (
      'new',
      'contacted',
      'meeting_scheduled',
      'proposal_sent',
      'won',
      'lost'
    )
  );
