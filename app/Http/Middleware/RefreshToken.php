<?php
namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

/*
    From: https://github.com/tymondesigns/jwt-auth/issues/1355
    - The client sends the credentials (email and password) to Laravel and receives a token (JWT) in response. This token is valid for JWT_TTL minutes. During this time all requests with the header Authorization = "Bearer token" will be successful.
    - For a request made after JWT_TTL minutes, that is, with the token expired, two situations will occur:
        1 - If there is less than JWT_REFRESH_TTL minutes since the creation of the token (the token carries within it the date of creation on claim IAT), then this token will be invalidated (blacklist) and a new token will be generated and sent as a response to the client. JWT_REFRESH_TTL defines how many minutes after creating the first token the new tokens can be created. For example, for JWT_REFRESH_TTL = 21600, new tokens will be generated for 15 days, after which time the user should reauthenticate.
        2 - The request occurs after JWT_REFRESH_TTL minutes after the first token was created. In this case, it will not be possible to generate a new token for the client and it must authenticate again. A 401 error will be sent to the client.
    - When multiple concurrent requests are made with the same JWT, it is possible that some of them fail, due to token regeneration on every request. Set grace period in seconds to prevent parallel request failure, because the JWT will consider to be valid for JWT_BLACKLIST_GRACE_PERIOD seconds, even if it's on the blacklist.
    - VERY WORTH HERE. When multiple concurrent requests are made with the same EXPIRED JWT, the default tymon/jwt-auth middleware will response to each request with a different new token. But there is a serious mistake in that. Only one of the tokens sent to the client will be valid and the others will be on the blacklist. Responses do not reach the client necessarily in the order they were sent by the API, so the client can save an invalid token and use it to submit new requests. My middleware solves this by checking if in the last JWT_BLACKLIST_GRACE_PERIOD seconds some new token has been generated for the client and in case it prevents a new token from being sent to the client.
*/
class RefreshToken extends BaseMiddleware {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next) {
        /* Check the request for the presence of a token */
        $this->checkForToken($request);
        try {
            /* If the user isn't found return error, on the AuthController@login this will be treat */
            if (!$this->auth->parseToken()->authenticate()) {
                throw new UnauthorizedHttpException('jwt-auth', 'Usuario no encontrado');
            }
            /* Obtain the auth payload */
            $payload = $this->auth->manager()->getPayloadFactory()->buildClaimsCollection()->toPlainArray();
            /* Token is valid, user logged then response without any token */
            return $next($request);
        /* Token expired. User not logged */
        } catch (TokenExpiredException $t) {
            /* Obtain the auth payload */
            $payload = $this->auth->manager()->getPayloadFactory()->buildClaimsCollection()->toPlainArray();
            $key = 'block_refresh_token_for_user_' . $payload['sub'];
            /* Discover if the key has been cached previously */
            $cachedBefore = (int) Cache::has($key);
            /* If a token already was refreshed and sent to the client in the last JWT_BLACKLIST_GRACE_PERIOD seconds */
            if ($cachedBefore) {
                /* Log the user using id */
                Auth::onceUsingId($payload['sub']);
                /* Token expired, send the response without any token because in grace period */
                return $next($request);
            }
            try {
                /* Get a new token */
                $newtoken = $this->auth->refresh();
                /* Determine new expiring time based on the grace period */
                $gracePeriod = $this->auth->manager()->getBlacklist()->getGracePeriod();
                $expiresAt = Carbon::now()->addSeconds($gracePeriod);
                Cache::put($key, $newtoken, $expiresAt);
            } catch (JWTException $e) {
                throw new UnauthorizedHttpException('jwt-auth', $e->getMessage(), $e, $e->getCode());
            }
        }
        /* Token refreshed and continue */
        $response = $next($request);
        /* Response with new token on header Authorization */
        return $this->setAuthenticationHeader($response, $newtoken);
    }
}
