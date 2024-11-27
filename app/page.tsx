'use client';

import React from "react";
import ThemeWrapper from "@/ts/theme";
import { Typography } from "@mui/material";
import ResultsEsc from "@/components/ResultsEsc";
import { useMediaQuery } from "@mui/material";

export default function Home() {
    // Detecta si el sistema usa modo oscuro
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    return (
        <div className="scroll-hidden h-screen w-full">
            <ThemeWrapper prefersDarkMode={prefersDarkMode}>
                <div className="flex flex-col items-center justify-center">
                    <Typography variant="h4" gutterBottom className="text-center mt-2">
                        Calculadora de subredes
                    </Typography>
                    <ResultsEsc />
                </div>
            </ThemeWrapper>
        </div>
    );
}
