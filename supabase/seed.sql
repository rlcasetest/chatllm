create table history (
    id uuid primary key default uuid_generate_v4(),
    sender varchar(4) not null,
    user_id uuid not null,
    message varchar(9999) not null,
    sent_at timestamp with time zone default now()
);

