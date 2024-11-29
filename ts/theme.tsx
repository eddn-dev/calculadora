import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2748A0',
        },
        secondary: {
            main: '#53D0EC',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000',
            secondary: '#4F4F4F',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#F5F5F5',
                    color: '#000000',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F8F0EE', // Fondo de la tabla
                    border: '1px solid #2748A0',
                    borderRadius: "3px",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #2748A0', // Bordes de las celdas
                    color: '#000000', // Color del texto
                },
                head: {
                    backgroundColor: '#F8F0EE', // Fondo del encabezado
                    color: '#000000', // Color del texto del encabezado
                    fontWeight: 'bold',
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F8F0EE',
                    border: '1px solid #2748A0',
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none', // Oculta la línea superior predeterminada
                    },
                    '&.Mui-expanded': {
                        margin: '0',
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F8F0EE',
                    '&:hover': {
                        backgroundColor: '#f0eae9',
                    },
                },
                expandIconWrapper: {
                    color: '#2748A0',
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F8F0EE',
                    border: '1px solid #2748A0',
                    borderRadius: "3px",
                },
                select: {
                    color: '#000000',
                },
                displayedRows: {
                    color: '#000000',
                },
                actions: {
                    color: '#2748A0',
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#F79193',
        },
        secondary: {
            main: '#FFCC80',
        },
        background: {
            default: '#121212',
            paper: '#1D1D1D',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#121212',
                    color: '#FFFFFF',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: '#231934', // Fondo de la tabla
                    border: '1px solid #F79193',
                    borderRadius: "3px",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #F79193', // Bordes de las celdas
                    color: '#FFFFFF', // Color del texto
                },
                head: {
                    backgroundColor: '#231934', // Fondo del encabezado
                    color: '#FFFFFF', // Color del texto del encabezado
                    fontWeight: 'bold',
                    fontSize: 14,
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: '#231934',
                    border: '1px solid #F79193',
                    borderRadius: "3px",
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: '0',
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#231934',
                    '&:hover': {
                        backgroundColor: '#2e2245',
                    },
                },
                expandIconWrapper: {
                    color: '#F79193',
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    backgroundColor: '#231934',
                    border: '1px solid #F79193',
                    borderRadius: "3px",
                },
                select: {
                    color: '#FFFFFF',
                },
                displayedRows: {
                    color: '#FFFFFF',
                },
                actions: {
                    color: '#F79193',
                },
            },
        },
    },
});

interface ThemeWrapperProps {
    children: React.ReactNode;
    prefersDarkMode: boolean;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, prefersDarkMode }) => {
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default ThemeWrapper;
