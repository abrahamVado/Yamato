<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class TenantRbacSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();
        if ($tenants->isEmpty()) {
            $tenants = collect([
                Tenant::create(['name' => 'Acme Inc.', 'slug' => 'acme']),
                Tenant::create(['name' => 'Umbrella Corp.', 'slug' => 'umbrella']),
            ]);
        }

        $permissions = [
            'users.view','users.create','users.update','users.delete',
            'orders.view','orders.create','orders.update','orders.delete',
        ];

        foreach ($tenants as $tenant) {
            app(PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);

            foreach ($permissions as $perm) {
                Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
            }

            $admin   = Role::firstOrCreate(['name' => 'admin','guard_name' => 'web','tenant_id' => $tenant->id]);
            $manager = Role::firstOrCreate(['name' => 'manager','guard_name' => 'web','tenant_id' => $tenant->id]);
            $viewer  = Role::firstOrCreate(['name' => 'viewer','guard_name' => 'web','tenant_id' => $tenant->id]);

            $admin->givePermissionTo(Permission::all());
            $manager->givePermissionTo(['orders.view','orders.create','orders.update','users.view']);
            $viewer->givePermissionTo(['orders.view','users.view']);

            // Attach first user to tenant as admin (demo only)
            $user = User::first();
            if ($user) {
                $user->assignRole('admin');
            }
        }
    }
}
