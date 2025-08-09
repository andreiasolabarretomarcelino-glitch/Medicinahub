-- Supabase schema for FSP/Kenntnisprüfung content
-- Lessons table
create table if not exists lessons (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    created_at timestamptz default timezone('utc', now()),
    updated_at timestamptz default timezone('utc', now())
);

-- Vocabulary table
create table if not exists vocabulary (
    id uuid primary key default uuid_generate_v4(),
    lesson_id uuid references lessons(id) on delete cascade,
    term text not null,
    definition text,
    language text default 'de',
    created_at timestamptz default timezone('utc', now()),
    updated_at timestamptz default timezone('utc', now())
);
