<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tenants', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->timestamps();
        });

        Schema::table('roles', function (Blueprint $t) {
            $t->foreignId('tenant_id')->nullable()->constrained('tenants')->nullOnDelete()->index();
            $t->unique(['name','guard_name','tenant_id']); // allow same role name per tenant
        });

    }

    public function down(): void {
        Schema::dropIfExists('tenants');
    }
};
