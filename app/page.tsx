'use client';

import React from "react";
import { Typography } from "@mui/material";
import Results from "@/components/Results";

export default function Home() {
  return (  
    <div className="flex flex-col items-center justify-center">
        <Typography variant="h4" gutterBottom className="text-center mt-2">
          Calculadora de subredes
        </Typography>
        <Results />
    </div>
  );
}
