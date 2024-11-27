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
            <Grid2 direction="column" container size={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <IP setIP={setTempIP} />
                    <Typography variant="overline" fontSize={28} marginTop={3.5} marginX={2}>
                        /
                    </Typography>
                    <NetMask setMask={setTempMask} />
                    <Typography variant="overline" fontSize={15} marginTop={3.5} marginX={2}>
                        Mover a
                    </Typography>
                    <SubnetMask setSubnetMask={setTempSubnetMaskValue} />
                </Grid2>
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <Button
                        variant="contained"
                        onClick={handleCalcular}
                        disabled={!tempIp}
                        className="mb-4 button"
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
                        />
                    </FormControl>
                </Grid2>
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    {/* Resultados básicos */}
                    {showBasicResults && results && (
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: "3xl",
                                p: 3,
                                mb: 4,
                                mx: "auto",
                            }}
                            marginTop={3}
                            className= "custom-box"
                        >
                            <Typography variant="h6" gutterBottom className="text-center pb-2">
                                Resultados de la Red
                            </Typography>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">IP: {Ip}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.inputIpBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">
                                        Máscara de Red: {results.maskDecimal} = {results.mask}
                                    </Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.maskBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2} className="pb-2">
                                <Grid2 size={6}>
                                    <Typography variant="overline">Bits para redes: {results.wildcardOriginalDecimal}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.wildcardOriginalBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">Red: {results.network}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.networkBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">Host Minimo: {results.hostMin}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.hostMinBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">Host Maximo: {results.hostMax}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.hostMaxBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">Broadcast: {results.broadcast}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline">{results.broadcastBinario}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container spacing={2}>
                                <Grid2 size={6}>
                                    <Typography variant="overline">Total de Hosts en la red: {results?.totalHosts}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="overline" className="pr-5">{results.tipo}</Typography>
                                    {results.priv ? <Typography variant="overline">Red privada</Typography> : ""}
                                </Grid2>
                            </Grid2>
                            
                            {SubnetMaskValue !== undefined && (
                                <>
                                    <hr/>
                                    <Typography variant="h6" gutterBottom className="text-center pb-2 pt-2">
                                        Para la subred
                                    </Typography>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={6}>
                                            <Typography variant="overline">Nueva mascara: {results.subnetMaskDecimal}</Typography>
                                        </Grid2>
                                        <Grid2 size={6}>
                                            <Typography variant="overline">{results.subnetMaskBinario}</Typography>
                                        </Grid2>
                                    </Grid2>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={6}>
                                            <Typography variant="overline">Bits para redes: {results.wildcardTotalDecimal}</Typography>
                                        </Grid2>
                                        <Grid2 size={6}>
                                            <Typography variant="overline">{results.wildcardTotalBinario}</Typography>
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
                        <TableContainer sx={{ maxHeight: '85vh', overflowY: 'auto' }} className="scroll-hidden">
                            <Table stickyHeader aria-label="sticky table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Redes</TableCell>
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
                                                            <Typography variant="h4">...</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return (
                                                <TableRow key={subnet.index}>
                                                    <TableCell>
                                                        <Accordion>
                                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                                Subred {subnet.index}
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline">Red: {subnet.red}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline">{subnet.redBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline">Host Min: {subnet.hostMin}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline">{subnet.hostMinBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline">Host Max: {subnet.hostMax}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline">{subnet.hostMaxBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline">Broadcast: {subnet.broadcast}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={7}>
                                                                        <Typography variant="overline">{subnet.broadcastBinario}</Typography>
                                                                    </Grid2>
                                                                </Grid2>
                                                                <Grid2 container spacing={2}>
                                                                    <Grid2 size={5}>
                                                                        <Typography variant="overline">Host por net: {results.hostsPerSubnet}</Typography>
                                                                    </Grid2>
                                                                    <Grid2 size={4}>
                                                                        <Typography variant="overline" className="pr-5">{results.tipo}</Typography>
                                                                        {results.priv ? <Typography variant="overline">Red privada</Typography> : ""}
                                                                    </Grid2>
                                                                </Grid2>
                                                                {/*<div className="space-y-2">
                                                                    <div>Red: {subnet.red}</div>
                                                                    <div>Rango de hosts: {subnet.rango}</div>
                                                                    <div>Broadcast: {subnet.broadcast}</div>
                                                                    <div>Host por red: {results.hostsPerSubnet}</div>
                                                                    <div>{results.tipo}</div>
                                                                    {results.priv ? <div>Red privada</div> : ""}
                                                                </div>*/}
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
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                )}
            </Grid2>
        </Grid2>
    );
}