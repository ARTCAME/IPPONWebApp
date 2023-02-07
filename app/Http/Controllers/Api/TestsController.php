<?php

namespace App\Http\Controllers\Api;

use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class TestsController extends Controller {
    /**
     * Get the all the tests by user
     *
     * @return Response with the array of the tests
     */
    public function getAllTests(Request $request) {
        try {
            $users = DB::collection('users')->get();
            $tests = [];
            foreach($users as $user) {
                if (array_key_exists('tests', $user)) {
                    foreach($user['tests'] as $test) {
                        array_push($tests, $test);
                    }
                }
            }
            return $tests;
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener todos los tests. Código de error BeTeCo@GeAlTe',
                'status' => 'danger',
                'title' => 'Obtener tests',
                'trace' => 'Error al obtener todos los tests. Código de error: BeTeCo@GeAlTe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Get the tests maded by the user
     *
     * @return Response with the array of the tests
     */
    public function getTests(Request $request) {
        try {
            $user = User::where('username', $request[0])->first();
            return $user['tests'];
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los tests del usuario. Código de error BeTeCo@GeTe',
                'status' => 'danger',
                'title' => 'Obtener tests',
                'trace' => 'Error al obtener los tests del usuario. Código de error: BeTeCo@GeTe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Save the tests maded by the user
     *
     * @return Response with the array of the tests
     */
    public function saveTests(Request $request) {
        try {
            $user = User::where('username', $request->username)->first();
            $user->push('tests', array($request->test));
            return $user;
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al guardar el tests. Código de error BeTeCo@SaTe',
                'status' => 'danger',
                'title' => 'Guardar tests',
                'trace' => 'Error al guardar el test. Código de error: BeTeCo@SaTe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
}
