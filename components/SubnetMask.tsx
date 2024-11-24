'use client';

import React from "react";
import { TextField, Typography } from "@mui/material";

interface SubnetMaskProps {
    setSubnetMask: (value: number) => void;
}

export default function SubnetMask({ setSubnetMask }: SubnetMaskProps) {
    const [localSubnetMask, setLocalSubnetMask] = React.useState<number>(30);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setLocalSubnetMask(value);
        setSubnetMask(value);
    };

    return(      
        <div className="grid grid-cols-1">
            <div className="flex mb-2">
                <Typography
                    variant="overline"
                >
                    Máscara de red para Subnet:
                </Typography>
            </div>
            <div className="-mt-2">
                <TextField 
                    id="outlined-basic"
                    label="Bits de la nueva MAC"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={localSubnetMask}
                    onChange={handleChange}  
                />
            </div>
        </div> 
    );
}
