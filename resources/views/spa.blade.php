<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Fonts -->
    {{-- <link rel="prefetch" as="font" href="../fonts/Myriad_Pro_Bold_Condensed_Italic.ttf" type="font/ttf" crossorigin="anonymous"> --}}
    {{-- Bootstrap --}}
    <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.css">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" >

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- No robots indexing --}}
    <meta name="robots" content="noindex">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'IPPONGYM') }}</title>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
    <script src="https://unpkg.com/tween.js@16.3.4"></script>
    <!-- Wacom scripts -->
    <script src="{{ asset('js/wcm/wgssSigCaptX.js') }}"></script>
    <script src="{{ asset('js/wcm/base64.js') }}"></script>
    <script src="{{ asset('js/wcm/SigCaptX-Utils.js') }}"></script>
    <script src="{{ asset('js/wcm/SigCaptX-SessionControl.js') }}"></script>
    <script src="{{ asset('js/wcm/SigCaptX-Globals.js') }}"></script>
</head>
<body>
    <div id="app">
        <app></app>
    </div>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
