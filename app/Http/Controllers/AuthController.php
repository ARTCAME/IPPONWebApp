<?php

namespace App\Http\Controllers;

use App\User;
use Exception;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller {
   /**
    * Create a new AuthController instance.
    *
    * @return void
    */
    public function __construct() {
        $this->middleware('jwt', ['except' => ['login']]);
    }
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
                'message' => 'Error al obtener los usuarios de la base de datos. Código de error BEAuCo@I',
                'status' => 'danger',
                'title' => 'Obtener usuarios',
                'trace' => 'Error al obtener todos los datos de la base de datos. Código de error: BEAuCo@I. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Login user and return a token
     *
     * @return Response with the user/token data or error
     */
    public function login(Request $request) {
        $credentials = $request->only('username', 'password');
        try {
            if ($token = JWTAuth::attempt($credentials)) {
                /* Stores the last login data */
                $user = JWTAuth::user();
                $user->last_login = Carbon::now()->toDateTimeString();
                $user->last_login_ip = $request->getClientIp();
                $user->login_count = $user->login_count + 1;
                $user->save();
                /* Return the successful login */
                return $this->respondWithToken($token, $user);
            }
        } catch (JWTException $jwte) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json([
            'message' => 'login_error'
        ], 401);
    }
    /**
     * Logout User
     *
     * @return Response
     */
    public function logout() {
        auth()->logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Logged out Successfully.'
        ], 200);
    }
    /**
     * Get the authenticated user
     *
     * @return Response with the current user
     */
    public function me() {
        return response()->json(auth()->user());
    }
    /**
     * Get authenticated user
     *
     * @return Response with the current user
     */
    public function user(Request $request) {
        $user = User::find(auth()->user()->id);
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }
    /**
     * Refresh JWT token
     */
    public function refresh() {
        return $this->respondWithToken(auth()->refresh(), auth()->user());
    }
    /**
     * Return auth guard
     */
    private function guard() {
        return auth()->guard('api');
    }
    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return Response
     */
    protected function respondWithToken($token, $user) {
        return response()->json([
            'token' => 'Bearer ' . $token,
            'token_type' => 'bearer',
            // 'expires_in' => Auth::factory()->getTTL() * 240,
            'expires_in' => auth()->factory()->getTTL() * 240,
            'user' => $user,
        ]);
    }
}
