<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Spatie\Permission\PermissionRegistrar;

class SetCurrentTenant
{
    /**
     * Domains that should NOT be treated as tenant subdomains.
     * e.g. "localhost", "127.0.0.1", your central domain, etc.
     */
    protected array $centralHosts = [
        'localhost',
        '127.0.0.1',
        '::1',
    ];

    public function handle(Request $request, Closure $next)
    {
        // 1) Allow health checks and CLI without tenant resolution
        if ($this->shouldBypass($request)) {
            return $next($request);
        }

        // 2) Try header override first (useful for API & dev)
        $slug = $this->fromHeader($request);

        // 3) Try path prefix /t/{slug}/...
        if (!$slug) {
            $slug = $this->fromPath($request);
        }

        // 4) Try subdomain
        if (!$slug) {
            $slug = $this->fromSubdomain($request);
        }

        if (!$slug) {
            throw new NotFoundHttpException('Tenant not resolved.');
        }

        $tenant = Tenant::where('slug', $slug)->first();
        if (!$tenant) {
            throw new NotFoundHttpException("Tenant '{$slug}' not found.");
        }

        // Store globally for this request
        app()->instance('currentTenant', $tenant);

        // Tell Spatie Permission which "team" (tenant) is active
        app(PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);

        return $next($request);
    }

    protected function shouldBypass(Request $request): bool
    {
        if (app()->runningInConsole()) return true;

        // Allow Laravel health endpoint or anything else you want to skip
        $path = ltrim($request->path(), '/');
        if ($path === 'up') return true;

        return false;
    }

    protected function fromHeader(Request $request): ?string
    {
        $v = trim((string) $request->headers->get('X-Tenant', ''));
        return $v !== '' ? $v : null;
    }

    protected function fromPath(Request $request): ?string
    {
        // matches /t/{slug}/... or /t/{slug}
        $segments = $request->segments();
        if (count($segments) >= 2 && $segments[0] === 't') {
            return $segments[1];
        }
        return null;
    }

    protected function fromSubdomain(Request $request): ?string
    {
        $host = $request->getHost(); // e.g. acme.localhost, api.acme.myapp.test
        // If host is an IP or central host, skip
        foreach ($this->centralHosts as $central) {
            if (strcasecmp($host, $central) === 0) return null;
            // also handle *.central
            if (str_ends_with($host, '.'.$central)) {
                // e.g. foo.127.0.0.1 (rare) -> allow subdomain
                // keep going
            }
        }

        $parts = explode('.', $host);
        if (count($parts) < 2) {
            return null; // no subdomain
        }

        // Heuristic: take the first label as tenant, unless it's a known central label
        $slug = $parts[0];

        // If you have a pattern like "api.acme.myapp.test", you might want second label instead.
        // Adjust this as needed (e.g., detect 'api' and take $parts[1]).
        if ($slug === 'www' || $slug === 'api') {
            $slug = $parts[1] ?? null;
        }

        return $slug ?: null;
    }
}
