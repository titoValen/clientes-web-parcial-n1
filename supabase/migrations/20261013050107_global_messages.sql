create table public.global_messages (
  id bigint generated always as identity not null,
  user_id uuid not null,
  content text not null,
  created_at timestamp with time zone not null default now(),
  constraint global_messages_pkey primary key (id),
  constraint global_messages_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE,
  constraint global_messages_content_check check (
    (
      (char_length(content) >= 1)
      and (char_length(content) <= 500)
    )
  )
) TABLESPACE pg_default;

create index IF not exists global_messages_created_at_idx on public.global_messages using btree (created_at desc) TABLESPACE pg_default;