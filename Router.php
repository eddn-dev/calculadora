<?php

namespace MVC;

class Router
{
    public array $getRoutes = [];
    public array $postRoutes = [];

    public function get($url, $fn)
    {
        $this->getRoutes[$url] = $fn;
    }

    public function post($url, $fn)
    {
        $this->postRoutes[$url] = $fn;
    }

    public function checkRoutes()
    {
        session_start();

        $currentUrl = $_SERVER['REQUEST_URI'] ?? '/';
        $method = $_SERVER['REQUEST_METHOD'];

        // Si la solicitud es para un archivo estático en /build/, servir el archivo
        if (preg_match('/\.(css|js|png|jpg|jpeg|gif|svg)$/', $currentUrl)) {
            $filePath = __DIR__ . '/../public' . $currentUrl;

            if (file_exists($filePath)) {
                // Detectar tipo de contenido
                $mimeType = mime_content_type($filePath);
                header("Content-Type: $mimeType");
                readfile($filePath);
                exit;
            } else {
                header("HTTP/1.0 404 Not Found");
                echo "Archivo no encontrado.";
                exit;
            }
        }

        // Verificar si la solicitud es para un endpoint de la API
        if (strpos($currentUrl, '/api/') === 0) {
            $currentUrl = explode('?', $currentUrl)[0];

            if ($method === 'GET') {
                $fn = $this->getRoutes[$currentUrl] ?? null;
            } else {
                $fn = $this->postRoutes[$currentUrl] ?? null;
            }

            if ($fn) {
                call_user_func($fn, $this);
            } else {
                header("HTTP/1.0 404 Not Found");
                echo json_encode(['error' => 'Endpoint no encontrado']);
            }
        } else {
            // Sirve la aplicación React
            $this->serveReactApp();
        }
    }

    private function serveReactApp()
    {
        $reactIndex = __DIR__ . '/public/index.html';

        if (file_exists($reactIndex)) {
            echo file_get_contents($reactIndex);
        } else {
            echo "Aplicación React no encontrada";
        }
    }
}
