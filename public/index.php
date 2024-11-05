<?php

use Controllers\ApiController;
use MVC\Router;

require_once __DIR__ . '/../includes/app.php';

$router = new Router();

// Definir rutas de API
$router->get('/api/data', [ApiController::class, 'getData']);

// Procesar rutas
$router->checkRoutes();
