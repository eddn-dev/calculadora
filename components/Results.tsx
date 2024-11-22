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
    TablePagination
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IP from "@/components/IP";
import NetMask from "@/components/Netmask";
import SubnetMask from "@/components/SubnetMask";
import calcularSubred from "@/ts/calculos";

export default function Results() {
    const [Ip, setIP] = React.useState('');
    const [Mask, setMask] = React.useState<number>(24);
    const [SubnetMaskValue, setSubnetMaskValue] = React.useState<number>(30);

    const [results, setResults] = React.useState<any>(null);
    const [visibleSubnets, setVisibleSubnets] = React.useState<any[]>([]); // Siempre será un arreglo
    const [isPartial, setIsPartial] = React.useState(false); // Control de la vista parcial
    const [showPagination, setShowPagination] = React.useState(false); // Control de la visibilidad de la paginación

    // Paginación
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleCalcular = () => {
        const calculatedResults = calcularSubred(Ip, Mask, SubnetMaskValue, isPartial);
        if (calculatedResults.error) {
            console.error('Error: ', calculatedResults.error);
            return;
        }
        setResults(calculatedResults);
        updateVisibleSubnets(calculatedResults, isPartial);

        // Determinar si se debe mostrar la paginación
        const subnetCount = Array.isArray(calculatedResults.subnets)
            ? calculatedResults.subnets.length
            : calculatedResults.subnets.firstSubnets.length + calculatedResults.subnets.lastSubnets.length;
        setShowPagination(!isPartial && subnetCount > rowsPerPage);

        setPage(0); // Reiniciar la página en la paginación
    };

    const updateVisibleSubnets = (results: any, partial: boolean) => {
        if (!results || !results.subnets) {
            setVisibleSubnets([]);
            return;
        }

        if (partial) {
            const { firstSubnets = [], lastSubnets = [] } = results.subnets;
            setVisibleSubnets([
                ...firstSubnets,
                { isPlaceholder: true }, // Agrega un marcador para "..."
                ...lastSubnets,
            ]);
        } else {
            setVisibleSubnets(Array.isArray(results.subnets) ? results.subnets : []); // Asegurarse de que sea un arreglo
        }
    };

    const handleTogglePartial = (checked: boolean) => {
        setIsPartial(checked); // Solo cambia el estado, no afecta la tabla ni la paginación
    };

    // Manejo de cambios en la paginación
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reinicia a la primera página
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <IP setIP={setIP} />
                <Typography variant="overline" fontSize={28} marginTop={3.5}>
                    /
                </Typography>
                <NetMask setMask={setMask} />
                <Typography variant="overline" fontSize={15} marginTop={3.5}>
                    Mover a
                </Typography>
                <SubnetMask setSubnetMask={setSubnetMaskValue} />
            </div>

            <Button
                variant="contained"
                onClick={handleCalcular}
                disabled={!Ip || !Mask}
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

            {results && (
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '3xl', // Coincide con la tabla
                        p: 3,
                        mb: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mx: 'auto' // Centrar horizontalmente
                    }}
                    marginTop={3}
                >
                    <Typography variant="h6" gutterBottom>
                        Resultados de la Subred
                    </Typography>
                    <Typography>IP: {Ip}</Typography>
                    <Typography>Máscara de Red: {Mask}</Typography>
                    <Typography>Máscara de Subred: {SubnetMaskValue}</Typography>
                    <Typography>Total de Hosts: {results.totalHosts}</Typography>
                    {results.tipo && <Typography>Tipo: {results.tipo}</Typography>}
                    {results.priv && <Typography>Red privada</Typography>}
                </Box>
            )}

            {results && (
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
                                                            <div className="space-y-2">
                                                                <div>Red: {subnet.red}</div>
                                                                <div>Rango de hosts: {subnet.rango}</div>
                                                                <div>Broadcast: {subnet.broadcast}</div>
                                                                <div>Host por red: {results.hostsPerSubnet}</div>
                                                                <div>{results.tipo}</div>
                                                                {results.priv ? <div>Red privada</div>: ''}
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Componente de paginación */}
                    {showPagination && (
                        <TablePagination
                            rowsPerPageOptions={[25, 30, 50, 100]}
                            component="div"
                            count={visibleSubnets.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
