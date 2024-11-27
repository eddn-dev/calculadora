import React from "react";
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
    FormControl,
    TablePagination,
    Grid2,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IP from "@/components/IP";
import NetMask from "@/components/Netmask";
import SubnetMask from "@/components/SubnetMask";
import calcularSubred from "@/ts/calculos";

export default function ResultsEsc() {
    const [tempIp, setTempIP] = React.useState("");
    const [tempMask, setTempMask] = React.useState<number | undefined>(undefined);
    const [tempSubnetMaskValue, setTempSubnetMaskValue] = React.useState<number | undefined>(undefined);

    const [Ip, setIP] = React.useState("");
    const [Mask, setMask] = React.useState<number | undefined>(undefined);
    const [SubnetMaskValue, setSubnetMaskValue] = React.useState<number | undefined>(undefined);

    const [results, setResults] = React.useState<any>(null);
    const [visibleSubnets, setVisibleSubnets] = React.useState<any[]>([]);
    const [isPartial, setIsPartial] = React.useState(false);

    const [showBasicResults, setShowBasicResults] = React.useState(false);
    const [showTable, setShowTable] = React.useState(false);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleCalcular = () => {
        // Verificar si hay cambios en las máscaras o submáscaras
        const hasMaskChanges =
            tempMask !== Mask || tempSubnetMaskValue !== SubnetMaskValue;

        if (hasMaskChanges) {
            // Reiniciar estados directamente aquí
            setMask(undefined);
            setSubnetMaskValue(undefined);
            setResults(null);
            setVisibleSubnets([]);
            setIsPartial(false);
            setShowBasicResults(false);
            setShowTable(false);
            setPage(0);
            setRowsPerPage(25);
        }

        if (!tempIp) {
            console.error("La IP no está proporcionada.");
            return;
        }

        // Actualiza los valores principales
        setIP(tempIp);
        setMask(tempMask);
        setSubnetMaskValue(tempSubnetMaskValue);

        // Realiza el cálculo
        const calculatedResults = calcularSubred(tempIp, tempMask, tempSubnetMaskValue, isPartial);

        if (calculatedResults.error) {
            console.error("Error: ", calculatedResults.error);
            return;
        }

        setResults(calculatedResults);
        setShowBasicResults(true); // Mostrar siempre los resultados básicos

        if (tempSubnetMaskValue === undefined) {
            // Si no hay submáscara, no mostrar la tabla
            return;
        }

        // Si hay submáscara, generar la tabla
        updateVisibleSubnets(calculatedResults, isPartial);
        setShowTable(true);
    };

    const updateVisibleSubnets = (results: any, partial: boolean) => {
        if (!results || !results.subnets) {
            setVisibleSubnets([]);
            return;
        }
    
        if (partial && results.subnets.firstSubnets && results.subnets.lastSubnets) {
            setVisibleSubnets([
                ...results.subnets.firstSubnets,
                { isPlaceholder: true },
                ...results.subnets.lastSubnets,
            ]);
        } else if (Array.isArray(results.subnets)) {
            setVisibleSubnets(results.subnets);
        } else {
            setVisibleSubnets([]);
        }
    };    

    const handleTogglePartial = (checked: boolean) => {
        setIsPartial(checked);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Grid2 container sx={{ height: '30vh', width: '97vw' }}>
            {/* Contenedor izquierdo */}
            <Grid2 direction="column" container size={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="pr-12">
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <IP setIP={setTempIP} />
                    <Typography variant="overline" fontSize={28} marginTop={4.5} marginX={2} className="texto">
                        /
                    </Typography>
                    <NetMask setMask={setTempMask} />
                    <Typography variant="overline" fontSize={15} marginTop={4.5} marginX={2} className="texto">
                        Mover a
                    </Typography>
                    <SubnetMask setSubnetMask={setTempSubnetMaskValue} />
                </Grid2>
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <Button
                        variant="contained"
                        onClick={handleCalcular}
                        disabled={!tempIp}
                        className="mb-4 button texto"
                    >
                        Calcular
                    </Button>
                </Grid2>
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isPartial}
                                    onChange={(e) => handleTogglePartial(e.target.checked)}
                                    className="custom-checkbox"
                                />
                            }
                            label="Calcular solo las primeras y últimas redes"
                            className="custom-label"
                        />
                    </FormControl>
                </Grid2>
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    {/* Resultados básicos */}
                    {showBasicResults && results && (
                        <Box
                            sx={{
                                width: "600px",
                                maxWidth: "1200px",
                                p: 2,
                                mb: 4,
                                mx: "auto",
                            }}
                            marginTop={3}
                            className= "custom-box"
                        >
                            <Typography variant="h6" gutterBottom className="text-center pb-2 texto">
                                Resultados de la Red
                            </Typography>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">IP: </Typography>
                                    <Typography variant="overline" className="texto-num">{Ip}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.inputIpBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Máscara de Red: </Typography>
                                    <Typography variant="overline" className="texto-num">{results.maskDecimal} = {results.mask}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.maskBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2} className="pb-2">
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Bits para redes: </Typography>
                                    <Typography variant="overline" className="texto-num">{results.wildcardOriginalDecimal}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.wildcardOriginalBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Red: </Typography>
                                    <Typography variant="overline" className="texto-num">{results.network}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.networkBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Host Minimo: </Typography>
                                    <Typography variant="overline" className="texto-num">{results.hostMin}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.hostMinBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Host Maximo: </Typography>
                                    <Typography variant="overline" className="texto-num">{results.hostMax}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.hostMaxBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Broadcast: </Typography>
                                    <Typography variant="overline" className="texto-num">{results.broadcast}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto-num">{results.broadcastBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="texto">Total de Hosts en la red: </Typography>
                                    <Typography variant="overline" className="texto-num">{results?.totalHosts}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="pr-5 texto">{results.tipo}</Typography>
                                    {results.priv ? <Typography variant="overline" className="texto">Red privada</Typography> : ""}
                                </Grid2>
                            </Grid2>
                            
                            {SubnetMaskValue !== undefined && (
                                <>
                                    <hr/>
                                    <Typography variant="h6" gutterBottom className="text-center pb-2 pt-2 texto mt-2">
                                        Para la subred
                                    </Typography>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={6}>
                                            <Typography variant="overline" className="texto">Nueva mascara: </Typography>
                                            <Typography variant="overline" className="texto-num">{results.subnetMaskDecimal}</Typography>
                                        </Grid2>
                                        <Grid2 size={6}>
                                            <Typography variant="overline" className="texto-num">{results.subnetMaskBinario}</Typography>
                                        </Grid2>
                                    </Grid2>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={6}>
                                            <Typography variant="overline" className="texto">Bits para redes: </Typography>
                                            <Typography variant="overline" className="texto-num">{results.wildcardTotalDecimal}</Typography>
                                        </Grid2>
                                        <Grid2 size={6}>
                                            <Typography variant="overline" className="texto-num">{results.wildcardTotalBinario}</Typography>
                                        </Grid2>
                                    </Grid2>
                                </>
                            )}
                        </Box>
                    )}
                </Grid2>
            </Grid2>
            {/* Contenedor derecho */}
            <Grid2 size={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                {/* Tabla de subredes */}
                {showTable && results && SubnetMaskValue !== undefined && visibleSubnets.length > 0 && (
                    <div className="w-full max-w-3xl">
                        <TableContainer sx={{ maxHeight: '100vh', overflowY: 'auto' }} className="scroll-hidden">
                            <Table stickyHeader aria-label="sticky table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="texto" sx= {{ fontSize: "17px" }}>Redes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleSubnets
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((subnet: any, index: number) => {
                                            if (subnet.isPlaceholder) {
                                                return (
                                                    <TableRow key={`placeholder-${index}`}>
                                                        <TableCell align="center">
                                                            <Typography variant="h4" className="texto-num">...</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return (
                                                <TableRow key={subnet.index}>
                                                    <TableCell>
                                                        <Accordion>
                                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                                <Typography className="texto pr-2">Subred</Typography><Typography className="texto-num" fontSize={14}>{subnet.index}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline" className="texto">Red: </Typography>
                                                                        <Typography variant="overline" className="texto-num">{subnet.red}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline" className="texto-num">{subnet.redBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline" className="texto">Host Min: </Typography>
                                                                        <Typography variant="overline" className="texto-num">{subnet.hostMin}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline" className="texto-num">{subnet.hostMinBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline" className="texto">Host Max: </Typography>
                                                                        <Typography variant="overline" className="texto-num">{subnet.hostMax}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline" className="texto-num">{subnet.hostMaxBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline" className="texto">Broadcast: </Typography>
                                                                        <Typography variant="overline" className="texto-num">{subnet.broadcast}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline" className="texto-num">{subnet.broadcastBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline" className="texto">Host por net: </Typography>
                                                                        <Typography variant="overline" className="texto-num">{results.hostsPerSubnet}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={4}>
                                                                        <Typography variant="overline" className="pr-5 texto">{results.tipo}</Typography>
                                                                        {results.priv ? <Typography variant="overline" className="texto">Red privada</Typography> : ""}
                                                                    </Grid2>
                                                                </Grid2>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[25, 30, 50, 100]}
                            component="div"
                            count={visibleSubnets.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage="Redes por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                )}
            </Grid2>
        </Grid2>
    );
}