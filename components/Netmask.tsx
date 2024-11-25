'use client';

import React from "react";
import { TextField, Typography } from "@mui/material";

interface NetMaskProps {
    setMask: (value: number) => void;
}

export default function NetMask({ setMask }: NetMaskProps) {
    const [localMask, setLocalMask] = React.useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setLocalMask(value);
            return;
        }

        const numericValue = Number(value);
        if (numericValue >= 1 && numericValue <= 32) {
            setLocalMask(value);
            setMask(numericValue);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:w-auto w-full">
            <div className="flex mb-2">
                <Typography variant="overline" className="text-center sm:text-left">
                    Máscara de red:
                </Typography>
            </div>
            <div className="-mt-2">
                <TextField
                    id="outlined-basic"
                    label="Bits MAC"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={localMask}
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
