<?php

namespace App\Http\Controllers\Api;

use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller {
    /**
     * Gets all the users from the database
     *
     * @return Response If the customers was retrieved returns it, if not returns a error message
     */
    public function index() {
        try {
            return DB::collection('users')->get();
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los usuarios de la base de datos. Código de error BeUsCo@In',
                'status' => 'danger',
                'title' => 'Obtener usuarios',
                'trace' => 'Error al obtener todos los datos de la base de datos. Código de error: BeUsCo@In. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Registers a new user
     *
     * @return Response with the user or the errorserror
     */
    public function register(Request $request) {
        $data = $request->all();
        $v = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'username' => 'required|min:3|unique:users',
            'email' => 'required|email|unique:users',
            'password'  => 'required|min:3|confirmed',
            'role' => 'required',
        ]);
        if ($v->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $v->errors()
            ], 422);
        }
        try {
            $user = new User();
            $user->name = $data['name'];
            $user->username = $data['username'];
            $user->email = $data['email'];
            $user->password = bcrypt($data['password']);
            $user->role = $data['role'];
            $user->wantNews = $data['role'] == 'tester' ? true : false;
            /* On the AuthController, the below data will be refreshed */
            $user->last_login = '';
            $user->last_login_ip = '';
            $user->login_count = 0;
            $user->save();
            return response()->json([
                'status' => 'success',
                'title' => 'Nuevo usuario',
                'message' => 'Usuario creado correctamente',
                'user' => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al guardar los datos. Código de error: BeUsCo@Re',
                'status' => 'danger',
                'title' => 'Edición de socio',
                'trace' => 'Error al guardar los datos editados del socio. Código de error: BeUsCo@Re. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Search a user by field/value provided
     *
     * @return User
     */
    public function search(Request $request) {
        try {
            $field = $request->get('field');
            $value = $request->get('value');
            return  User::where($field, '=', $value)->get();
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la búsqueda de usuario. Código de error BeUsCo@Se',
                'status' => 'danger',
                'title' => 'Buscar usuarios',
                'trace' => 'Error al obtener la búsqueda de usuario. Código de error: BeUsCo@Se. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Get if the user wants to show the news page
     *
     * @return Boolean
     */
    public function showNews(Request $request) {
        try {
            $user = User::where('username', $request->username)->first();
            return response()->json($user->wantNews);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los datos. Código de error BeUsCo@ShNe',
                'status' => 'danger',
                'title' => 'Obtener news status',
                'trace' => 'Error al obtener la búsqueda de usuario. Código de error: BeUsCo@ShNe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Set the news wants to false, the user doesn't want to see the news page (this is automatic when the modal on the view is closed at the first time)
     */
    public function unwantNews(Request $request) {
        try {
            $user = User::where('username', $request->username)->first();
            $user->wantNews = false;
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al guardar el estado. Código de error BeUsCo@UnNe',
                'status' => 'danger',
                'title' => 'Establecer news status',
                'trace' => 'Error al actualizar el usuario. Código de error: BeUsCo@UnNe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Updates the role, email and name of a user
     */
    public function update(Request $request) {
        try {
            $user = User::where('username', $request->username)->first();
            $fields = ['name', 'email', 'role', 'wantNews'];
            foreach ($fields as $field) {
                $user->$field = $request->$field;
            }
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el usuario. Código de error BeUsCo@Up',
                'status' => 'danger',
                'title' => 'Actualizar usuario',
                'trace' => 'Error al actualizar el usuario. Código de error: BeUsCo@Up. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Set the news wants to true using the role as constrinct
     */
    public function wantNews(Request $request) {
        try {
            $users = User::where('role', 'tester')->orWhere('role', 'root')->get();
            foreach ($users as $user) {
                $user->wantNews = true;
                $user->save();
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al guardar el estado. Código de error BeUsCo@WaNe',
                'status' => 'danger',
                'title' => 'Obtener news status',
                'trace' => 'Error al actualizar el usuario. Código de error: BeUsCo@WaNe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
}
