create table public.profiles (
  id uuid not null,
  display_name text not null,
  bio text null,
  avatar_url text null,
  created_at timestamp with time zone not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_bio_check check ((char_length(bio) <= 300)),
  constraint profiles_display_name_check check (
    (
      (char_length(display_name) >= 2)
      and (char_length(display_name) <= 50)
    )
  )
) TABLESPACE pg_default;