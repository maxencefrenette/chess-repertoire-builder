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

create type
  color as enum ('w', 'b');

create table
  public.positions (
    fen character varying not null,
    repertoire_id uuid not null,
    turn color not null,
    frequency double precision not null,
    created_at timestamp
    with
      time zone default now()
  );

alter table
  public.positions enable row level security;

create table
  public.repertoires (
    name character varying not null,
    created_at timestamp
    with
      time zone not null default now(),
      user_id uuid not null,
      id uuid not null default uuid_generate_v4(),
      lichess_speeds character varying not null,
      lichess_ratings character varying not null
  );

alter table
  public.repertoires enable row level security;

CREATE UNIQUE INDEX "lichess-studies_pkey" ON public.lichess_studies USING btree (id);

CREATE UNIQUE INDEX positions_children_pkey ON public.moves USING btree (parent_fen, child_fen, repertoire_id);

CREATE UNIQUE INDEX positions_pkey ON public.positions USING btree (fen, repertoire_id);

CREATE UNIQUE INDEX repertoires_pkey ON public.repertoires USING btree (id);

alter table
  "public"."lichess_studies"
add
  constraint "lichess-studies_pkey" PRIMARY KEY using index "lichess-studies_pkey";

alter table
  "public"."moves"
add
  constraint "positions_children_pkey" PRIMARY KEY using index "positions_children_pkey";

alter table
  "public"."positions"
add
  constraint "positions_pkey" PRIMARY KEY using index "positions_pkey";

alter table
  "public"."repertoires"
add
  constraint "repertoires_pkey" PRIMARY KEY using index "repertoires_pkey";

alter table
  positions
add
  constraint positions_repertoire_id_fkey FOREIGN KEY (repertoire_id) REFERENCES repertoires(id) on delete cascade;

alter table
  repertoires
add
  constraint repertoires_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on delete cascade;

alter table
  moves
add
  constraint move_child_position_fkey foreign key (repertoire_id, child_fen) references positions(repertoire_id, fen) on delete cascade;

alter table
  moves
add
  constraint move_parent_position_fkey foreign key (repertoire_id, parent_fen) references positions(repertoire_id, fen) on delete cascade;

create policy
  "Enable all access for users based on user_id" on "public"."moves" as permissive for all to public using (
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
  "Enable all access for users based on user_id" on "public"."positions" as permissive for all to public using (
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

create policy
  "Enable all access for users based on user_id" on "public"."repertoires" as permissive for all to public using ((auth.uid() = user_id));

create function
  delete_orphan_positions() returns trigger as $$ begin
delete from
  positions
where
  positions.repertoire_id = old.repertoire_id
  and positions.fen = old.child_fen
  and not exists (
    select
      *
    from
      moves
    where
      moves.repertoire_id = old.repertoire_id
      and moves.child_fen = old.child_fen
  );

return null;

end;

$$ language plpgsql;

create trigger
  example_trigger
after
delete
  on moves for each row
execute
  procedure delete_orphan_positions();

-- Finds positions where the no moves are selected and it's the player's turn to play
create function
  find_repertoire_holes_type_1(repertoire_id uuid) returns setof positions as $$ begin

  return query select * from positions
  where
    positions.repertoire_id = find_repertoire_holes_type_1.repertoire_id and
    positions.turn = 'w' and
    not exists (
      select
        *
      from
        moves
      where
        moves.repertoire_id = positions.repertoire_id
        and moves.parent_fen = positions.fen
    )
  order by positions.frequency desc;

end;

$$ language plpgsql;

-- Finds positions where a popular move for the opponent is not accounted for
create function
  find_repertoire_holes_type_2(repertoire_id uuid) returns setof positions as $$ begin

  return query select
    positions.fen,
    positions.repertoire_id,
    positions.turn,
    positions.frequency * (1 - coalesce(sum(moves.move_frequency), 0)) as frequency, -- Hack here, this is not the position's frequency, but it works
    positions.created_at
  from positions
  left join moves on
    moves.repertoire_id = positions.repertoire_id and
    moves.parent_fen = positions.fen
  where
    positions.repertoire_id = find_repertoire_holes_type_2.repertoire_id and
    positions.turn = 'b'
  group by positions.fen, positions.repertoire_id, positions.turn, positions.frequency, positions.created_at
  order by frequency desc;

end;

$$ language plpgsql;