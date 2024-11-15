import React from "react";
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox, FormControl, TablePagination } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IP from "@/components/IP";
import NetMask from "@/components/Netmask";
import SubnetMask from "@/components/SubnetMask";
import calcularSubred from "@/ts/calculos";

export default function Results() {
    // Estado inputs
    const [Ip, setIP] = React.useState('');
    const [Mask, setMask] = React.useState<number>(24);
    const [Subnetmask, setSubnetmask] = React.useState<number>(30);

    // Cantidad de subnets
    const [results, setResults] = React.useState<any>(null);

    // Cantidad de resultados a mostar
    const [showPartialResults, setShowPartialResults] = React.useState(false);

    // Calculo de redes
    const handleCalcular = () => {
        const calculatedResults = calcularSubred(Ip, Mask, Subnetmask, showPartialResults);
        setResults(calculatedResults);

        if (calculatedResults.error) {
            console.error('Error: ', calculatedResults.error);
            return;
        }

        /*if (Results.error) {
            console.error('Error:', Results.error);
            return;
        }

        console.log(`
        Tipo de IP: ${Results.tipo}
        Máscara de subred: ${Results.subnetMask}
        Máscara en decimal: ${Results.subnetMaskDecimal}
        Total de subredes: ${Results.totalSubnets}
        Hosts por subred: ${Results.hostsPerSubnet}
        Incremento de subred: ${Results.subnetIncrement}
        `);

        if (Results.showAllSubnets) {
            console.log('Todas las subredes:', Results.subnets);
        } else {
            console.log('Primeras subredes:', (Results.subnets as any).firstSubnets);
            console.log('Últimas subredes:', (Results.subnets as any).lastSubnets);
        }*/
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <div className="p-0">
                    <IP setIP={setIP} />
                </div>
                <div className="p-0 mt-4 md:mt-8">
                    <Typography variant="overline" fontSize={28}>
                        /
                    </Typography>
                </div>
                <div className="p-0">
                    <NetMask setMask={setMask} />
                </div>
                <div className="p-0 mt-4 md:mt-8">
                    <Typography variant="overline" fontSize={15}>
                        Mover a
                    </Typography>
                </div>
                <div className="p-0">
                    <SubnetMask setSubnetMask={setSubnetmask} />
                </div>
            </div>

            <Button
                variant="contained"
                onClick={handleCalcular}
                disabled={!Ip || !Mask}
                className="mb-4"
            >
                Calcular
            </Button>
            
            <div>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={showPartialResults}
                                onChange={(e) => setShowPartialResults(e.target.checked)}
                            />
                        } 
                        label="Calcular solo las primeras y ultimas redes"/>
                </FormControl>
            </div>
            <div className="w-full max-w-3xl">
                <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Redes
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results && (results.showAllSubnets ?
                                // Muestra todas las subredes
                                results.subnets.map((subnet: any) => (
                                    <TableRow key={subnet.index}>
                                        <TableCell>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    Subred {subnet.index}
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className="space-y-2">
                                                        <div>Red: {subnet.red}</div>
                                                        <div>Broadcast: {subnet.broadcast}</div>
                                                        <div>Rango de hosts: {subnet.rango}</div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                            )):
                            //Para primeras y ultimas subredes
                            <>
                                {results.subnets.firstSubnets.map((subnet: any) => (
                                    <TableRow key={subnet.index}>
                                        <TableCell>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    Subred {subnet.index}
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className="space-y-2">
                                                        <div>Red: {subnet.red}</div>
                                                        <div>Broadcast: {subnet.broadcast}</div>
                                                        <div>Rango de hosts: {subnet.rango}</div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!results.showAllSubnets && <TableRow><TableCell>...</TableCell></TableRow>}
                                {results.subnets.lastSubnets.map((subnet: any) => (
                                    <TableRow key={subnet.index}>
                                        <TableCell>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    Subred {subnet.index}
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className="space-y-2">
                                                        <div>Red: {subnet.red}</div>
                                                        <div>Broadcast: {subnet.broadcast}</div>
                                                        <div>Rango de hosts: {subnet.rango}</div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}

                            {/*<TableRow>
                                <TableCell>
                                    <Accordion>
                                        <AccordionSummary>
                                            Acordion1
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia animi corrupti corporis enim asperiores non harum beatae porro aspernatur sequi? Voluptatum nihil incidunt corrupti totam minima odio esse amet libero?
                                        </AccordionDetails>
                                    </Accordion>
                                </TableCell>
                            </TableRow>*/}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
