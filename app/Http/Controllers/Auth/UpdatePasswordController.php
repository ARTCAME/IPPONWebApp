<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class UpdatePasswordController extends Controller {
    /**
     * Update the password for the user.
     *
     * @param  Request  $request
     * @return Response
     */
    public function updatePassword(Request $request) {
        try {
            /* Store the new password for the user requested */
            $user = User::where('username', $request->username)->first();
            $user->fill([
                'password' => Hash::make($request->newPassword)
            ])->save();
            return [
                'message' => 'Contraseña actualizada correctamente.',
                'status' => 'success',
                'title' => 'Actualización de contraseña',
            ];
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al registrar la nueva contraseña. Código de error: BeUpCo@UpPa',
                'status' => 'danger',
                'title' => 'Error',
                'trace' => 'Error al registrar la nueva contraseña. Código de error: BeUpCo@UpPa. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
}
