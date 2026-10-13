create table public.posts (
  id bigint generated always as identity not null,
  user_id uuid not null,
  content text not null,
  created_at timestamp with time zone not null default now(),
  constraint posts_pkey primary key (id),
  constraint posts_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE,
  constraint posts_content_check check (
    (
      (char_length(content) >= 1)
      and (char_length(content) <= 500)
    )
  )
) TABLESPACE pg_default;

create index IF not exists posts_user_id_created_at_idx on public.posts using btree (user_id, created_at desc) TABLESPACE pg_default;

create index IF not exists posts_created_at_idx on public.posts using btree (created_at desc) TABLESPACE pg_default;