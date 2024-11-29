'use client';

import React from "react";
import { TextField, Typography } from "@mui/material";

interface IPProps {
    setIP: (value: string) => void;
}

export default function IP({ setIP }: IPProps) {
    const [localIP, setLocalIP] = React.useState('');
    const [error, setError] = React.useState(false);

    const validateIP = (ip: string) => {
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ip = e.target.value;
        setLocalIP(ip);

        if (validateIP(ip)) {
            setError(false);
            setIP(ip);
        } else {
            setError(true);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:w-auto w-full">
            <div className="flex mb-2">
                <Typography variant="overline" className="text-center sm:text-left texto">
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
                    error={error}
                    helperText={error ? "Ingrese una IP válida (e.g., 192.168.0.1)" : ""}
                    className="text-field texto"
                />
            </div>
        </div>
    );
}
