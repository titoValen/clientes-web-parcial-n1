create table public.private_messages (
  id bigint generated always as identity not null,
  sender_id uuid not null,
  receiver_id uuid not null,
  content text not null,
  created_at timestamp with time zone not null default now(),
  constraint private_messages_pkey primary key (id),
  constraint private_messages_receiver_id_fkey foreign KEY (receiver_id) references profiles (id) on delete CASCADE,
  constraint private_messages_sender_id_fkey foreign KEY (sender_id) references profiles (id) on delete CASCADE,
  constraint private_messages_check check ((sender_id <> receiver_id)),
  constraint private_messages_content_check check (
    (
      (char_length(content) >= 1)
      and (char_length(content) <= 500)
    )
  )
) TABLESPACE pg_default;

create index IF not exists private_messages_sender_receiver_idx on public.private_messages using btree (sender_id, receiver_id, created_at desc) TABLESPACE pg_default;

create index IF not exists private_messages_receiver_idx on public.private_messages using btree (receiver_id) TABLESPACE pg_default;