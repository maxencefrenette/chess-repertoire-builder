create table public.lichess_studies (
  id character varying not null,
  last_refreshed timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table
  public.lichess_studies enable row level security;

create table public.moves (
  parent_fen character varying not null,
  child_fen character varying not null,
  move_frequency double precision not null,
  created_at timestamp with time zone not null default now(),
  move character varying not null,
  repertoire_id uuid not null
);

alter table
  public.moves enable row level security;

create table public.positions (
  fen character varying not null,
  repertoire_id uuid not null,
  created_at timestamp with time zone default now(),
  frequency double precision not null
);

alter table
  public.positions enable row level security;

create table public.repertoires (
  name character varying not null,
  created_at timestamp with time zone not null default now(),
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
  "public"."positions"
add
  constraint "positions_repertoire_id_fkey" FOREIGN KEY (repertoire_id) REFERENCES repertoires(id);

alter table
  "public"."repertoires"
add
  constraint "repertoires_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

create policy "Enable all access for users based on user_id" on "public"."moves" as permissive for all to public using (
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

create policy "Enable all access for users based on user_id" on "public"."positions" as permissive for all to public using (
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

create policy "Enable all access for users based on user_id" on "public"."repertoires" as permissive for all to public using ((auth.uid() = user_id));
