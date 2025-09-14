<?php

if (! function_exists('tenant')) {
    function tenant(): ?\App\Models\Tenant {
        return app()->bound('currentTenant') ? app('currentTenant') : null;
    }
}
