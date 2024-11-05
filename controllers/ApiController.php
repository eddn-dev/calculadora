<?php

namespace Controllers;

class ApiController
{
    public static function getData()
    {
        // Simular datos de respuesta
        $data = [
            'message' => '¡Hola desde la API en PHP! no se como integrar next.js'
        ];

        header('Content-Type: application/json');
        echo json_encode($data);
    }
}
