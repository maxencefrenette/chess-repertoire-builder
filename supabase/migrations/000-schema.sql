create type
  color as enum ('w', 'b');

-- #region Repertoires table
create table
  public.repertoires (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null,
    name character varying not null,
    color color not null,
    lichess_speeds character varying not null,
    lichess_ratings character varying not null,
    created_at timestamp
    with
      time zone not null default now(),
      foreign key (user_id) references auth.users(id) on delete cascade
  );

alter table
  public.repertoires enable row level security;

create policy
  "Enable all access for users based on user_id" on repertoires as permissive for all to public using ((auth.uid() = user_id));

-- #endregion
create table
  public.lichess_studies (
    id character varying not null,
    last_refreshed timestamp
    with
      time zone,
      created_at timestamp
    with
      time zone default now()
  );

alter table
  public.lichess_studies enable row level security;

create table
  public.moves (
    repertoire_id uuid not null,
    parent_fen character varying not null,
    child_fen character varying not null,
    san character varying not null,
    move_frequency double precision not null,
    created_at timestamp
    with
      time zone not null default now()
  );

alter table
  public.moves enable row level security;

create table
  public.positions (
    fen character varying not null,
    repertoire_id uuid not null,
    turn color not null,
    frequency double precision not null,
    transpositions smallint not null,
    created_at timestamp
    with
      time zone default now()
  );

alter table
  public.positions enable row level security;

CREATE UNIQUE INDEX lichess_studies_pkey ON public.lichess_studies USING btree (id);

CREATE UNIQUE INDEX positions_children_pkey ON public.moves USING btree (parent_fen, child_fen, repertoire_id);

CREATE UNIQUE INDEX positions_pkey ON public.positions USING btree (fen, repertoire_id);

alter table
  lichess_studies
add
  constraint lichess_studies_pkey PRIMARY KEY using index lichess_studies_pkey;

alter table
  moves
add
  constraint positions_children_pkey PRIMARY KEY using index positions_children_pkey;

alter table
  positions
add
  constraint positions_pkey PRIMARY KEY using index positions_pkey;

alter table
  positions
add
  constraint positions_repertoire_id_fkey FOREIGN KEY (repertoire_id) REFERENCES repertoires(id) on delete cascade;

alter table
  moves
add
  constraint move_child_position_fkey foreign key (repertoire_id, child_fen) references positions(repertoire_id, fen) on delete cascade;

alter table
  moves
add
  constraint move_parent_position_fkey foreign key (repertoire_id, parent_fen) references positions(repertoire_id, fen) on delete cascade;

create policy
  "Enable all access for users based on user_id" on moves as permissive for all to public using (
    (
      auth.uid() = (
        SELECT
          repertoires.user_id
        FROM
          repertoires
        WHERE
          (repertoires.id = moves.repertoire_id)
      )
    )
  );

create policy
  "Enable all access for users based on user_id" on positions as permissive for all to public using (
    (
      auth.uid() = (
        SELECT
          repertoires.user_id
        FROM
          repertoires
        WHERE
          (repertoires.id = positions.repertoire_id)
      )
    )
  );