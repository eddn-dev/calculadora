'use client';

import React from "react";
import { TextField, Typography } from "@mui/material";

interface SubnetMaskProps {
    setSubnetMask: (value: number) => void;
}

export default function SubnetMask({ setSubnetMask }: SubnetMaskProps) {
    const [localSubnetMask, setLocalSubnetMask] = React.useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setLocalSubnetMask(value);
            return;
        }

        const numericValue = Number(value);
        if (numericValue >= 1 && numericValue <= 32) {
            setLocalSubnetMask(value);
            setSubnetMask(numericValue);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:w-auto w-full">
            <div className="flex mb-2">
                <Typography variant="overline" className="text-center sm:text-left">
                    Máscara de Subnet:
                </Typography>
            </div>
            <div className="-mt-2">
                <TextField
                    id="outlined-basic"
                    label="Bits nueva MAC"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={localSubnetMask}
                    onChange={handleChange}
                    className="text-field"
                    slotProps={{
                        input: {
                            inputProps: {
                                min: 1,
                                max: 32,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
