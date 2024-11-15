'use client';

import React from "react";
import { TextField, Typography } from "@mui/material";

interface IPProps {
    setIP: (value: string) => void;
}

export default function IP({ setIP }: IPProps ){
    const [localIP, setLocalIP] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalIP(e.target.value);
        setIP(e.target.value);
    };

    return(      
        <div className="grid grid-cols-1">
            <div className="flex mb-2">
                <Typography
                    variant="overline"
                >
                    Dirección IP:
                </Typography>
            </div>
            <div className="-mt-2">
                <TextField 
                    id="outlined-basic"
                    label="Host o Network"
                    variant="outlined"
                    size="small"
                    value={localIP}
                    onChange={handleChange}  
                    />
            </div>
        </div> 
    );
}
