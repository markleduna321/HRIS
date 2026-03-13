<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPasswordChanged
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is authenticated and hasn't changed password yet
        if ($user && is_null($user->password_changed_at)) {
            // Skip password change requirement for applicants
            if ($user->hasRole('applicant')) {
                return $next($request);
            }
            
            // Allow access to change password route and logout
            if (!$request->routeIs('password.change') && !$request->routeIs('password.update') && !$request->routeIs('logout')) {
                return redirect()->route('password.change');
            }
        }

        return $next($request);
    }
}

