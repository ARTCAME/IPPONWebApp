<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Session;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller {

    /**
     * Returns the sessions data
     *
     * @return mixed
     */
    public function getSessions(Request $request) {
        try {
            return DB::collection('sessions')->get();
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener las sessiones. Código de error: BeSeCo@GeSe',
                'status' => 'danger',
                'title' => 'Obtener sesiones',
                'trace' => 'Error al obtener las sessiones. Código de error: BeSeCo@GeSe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Stores the session data to manage the activity of the users
     */
    public function updateSession(Request $request) {
        try {
            $existingSession = Session::where('user_id', $request->id)->first();
            if (!$existingSession) {
                /* If the user doesn't has registry on the sessions table create it */
                $session = new Session();
                $session->user_id = $request->id;
                $session->last_ip = $request->getClientIp();
                $session->save();
            } else {
                /* If the user has a registry on the sessions table update its update_at date */
                $existingSession->last_ip = $request->getClientIp();
                $existingSession->touch();
                $existingSession->save();
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la sesión. Código de error: BeSeCo@UpSe',
                'status' => 'danger',
                'title' => 'Actualizar sesión',
                'trace' => 'Error al actualizar la sesión. Código de error: BeSeCo@UpSe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
}
