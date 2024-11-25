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

export default function Results() {
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

    // Reinicia los estados excepto la IP
    const resetStatesExceptIP = () => {
        setTempMask(undefined);
        setTempSubnetMaskValue(undefined);

        setMask(undefined);
        setSubnetMaskValue(undefined);

        setResults(null);
        setVisibleSubnets([]);
        setIsPartial(false);

        setShowBasicResults(false);
        setShowTable(false);

        setPage(0);
        setRowsPerPage(25);
    };

    const handleCalcular = () => {
        // Verificar si hay cambios en las máscaras o submáscaras
        const hasMaskChanges =
            tempMask !== Mask || tempSubnetMaskValue !== SubnetMaskValue;

        if (hasMaskChanges) {
            // Reinicia los estados si hay cambios en las máscaras
            resetStatesExceptIP();
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

        if (partial) {
            const { firstSubnets = [], lastSubnets = [] } = results.subnets;
            setVisibleSubnets([...firstSubnets, { isPlaceholder: true }, ...lastSubnets]);
        } else {
            setVisibleSubnets(Array.isArray(results.subnets) ? results.subnets : []);
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
        <div className="flex flex-col items-center">
            {/* Formulario de entrada */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <IP setIP={setTempIP} />
                <Typography variant="overline" fontSize={28} marginTop={3.5}>
                    /
                </Typography>
                <NetMask setMask={setTempMask} />
                <Typography variant="overline" fontSize={15} marginTop={3.5}>
                    Mover a
                </Typography>
                <SubnetMask setSubnetMask={setTempSubnetMaskValue} />
            </div>

            <Button
                variant="contained"
                onClick={handleCalcular}
                disabled={!tempIp}
                className="mb-4"
            >
                Calcular
            </Button>

            <FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isPartial}
                            onChange={(e) => handleTogglePartial(e.target.checked)}
                        />
                    }
                    label="Calcular solo las primeras y últimas redes"
                />
            </FormControl>

            {/* Resultados básicos */}
            {showBasicResults && results && (
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "3xl",
                        p: 3,
                        mb: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        mx: "auto",
                    }}
                    marginTop={3}
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
                            <Typography variant="overline">Máscara de Red: {results.mask}</Typography>
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
                    <hr/>
                    <Typography variant="h6" gutterBottom className="text-center pb-2 pt-2">
                        Para la subred
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                            <Typography variant="overline">Nueva mascara: {results.subnetMask}</Typography>
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
                </Box>
            )}

            {/* Tabla de subredes */}
            {showTable && results && SubnetMaskValue !== undefined && visibleSubnets.length > 0 && (
                <div className="w-full max-w-3xl">
                    <TableContainer sx={{ maxHeight: 400 }}>
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
        </div>
    );
}
