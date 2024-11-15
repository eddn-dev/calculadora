'use client';

import React from "react";
import { TextField, Typography } from "@mui/material";

interface NetMaskProps {
    setMask: (value: number) => void;
}

export default function NetMask({ setMask }: NetMaskProps){
    const [localMask, setLocalMask] = React.useState<number>(24);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setLocalMask(value);
        setMask(value);
    }

    return(      
        <div className="grid grid-cols-1">
            <div className="flex mb-2">
                <Typography
                    variant="overline"
                >
                    Máscara de red:
                </Typography>
            </div>
            <div className="-mt-2">
                <TextField 
                    id="outlined-basic"
                    label="Bits de la MAC"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={localMask}
                    onChange={handleChange}  
                    />
            </div>
        </div> 
    );
}
