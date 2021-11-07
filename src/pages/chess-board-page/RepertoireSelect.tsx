import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useQuery } from 'react-query';
import { useSupabase } from '../../hooks/supabase';
import { Repertoire } from '../../models/repertoire';
import { useStore } from '../../store';

export const RepertoireSelect = observer(() => {
    const store = useStore();
    const supabase = useSupabase();

    const { status, data: repertoires } = useQuery('repertoires', async () => {
        const { data, error } = await supabase.from<Repertoire>('repertoires').select();

        if (error !== null) {
            throw error;
        }

        return data!;
    });

    if (status === 'success') {
        const handleChange = action("setRepertoire", (event: SelectChangeEvent) => {
            const repertoireId = event.target.value as string;

            if (repertoireId === "") {
                store.ui.repertoire = undefined;
            } else {
                store.ui.repertoire = repertoires!.find(r => r.id === repertoireId);
            }
        });

        return (
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="repertoire-select-label">Repertoire</InputLabel>
                <Select
                    labelId="repertoire-select-label"
                    id="repertoire-select"
                    variant="standard"
                    value={store.ui.repertoire?.id || ""}
                    label="Repertoire"
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {repertoires!.map((r) => (
                        <MenuItem key={r.id} value={r.id}>
                            {r.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    } else {
        return null;
    }
});
