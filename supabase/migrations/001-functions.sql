-- Delete the potential orphan position when a move is deleted
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