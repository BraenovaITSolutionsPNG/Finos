<?php

namespace Tests\Feature\Api;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthAndTenantTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_creates_owner_tenant(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Jane Kila',
            'email' => 'jane@acme.pg',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'tenant_name' => 'Acme Traders',
            'country' => 'PG',
            'currency' => 'PGK',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'email'], 'tenant' => ['id', 'slug']]);

        $this->assertDatabaseHas('users', ['email' => 'jane@acme.pg']);
        $tenant = Tenant::where('name', 'Acme Traders')->first();
        $this->assertNotNull($tenant);
        $this->assertSame('owner', $tenant->users()->first()->pivot->role);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create(['password' => 'password123']);
        $tenant = Tenant::create(['name' => 'T', 'slug' => 't-'.uniqid(), 'currency' => 'PGK']);
        $tenant->users()->attach($user->id, ['role' => 'owner', 'joined_at' => now()]);
        $user->update(['current_tenant_id' => $tenant->id]);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['token', 'user']);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrong',
        ])->assertStatus(401);
    }

    public function test_authenticated_user_can_list_tenants_and_members(): void
    {
        $owner = User::factory()->create();
        $tenant = Tenant::create(['name' => 'Biz', 'slug' => 'biz-'.uniqid(), 'currency' => 'PGK']);
        $tenant->users()->attach($owner->id, ['role' => 'owner', 'joined_at' => now()]);
        $owner->update(['current_tenant_id' => $tenant->id]);

        $token = $owner->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/tenants')
            ->assertOk()
            ->assertJsonCount(1);

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/tenants/{$tenant->id}/members")
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_non_member_cannot_access_other_tenant(): void
    {
        $owner = User::factory()->create();
        $other = Tenant::create(['name' => 'Other', 'slug' => 'other-'.uniqid(), 'currency' => 'PGK']);
        $owner->update(['current_tenant_id' => $other->id]);
        $token = $owner->createToken('test')->plainTextToken;

        $target = Tenant::create(['name' => 'Secret', 'slug' => 'secret-'.uniqid(), 'currency' => 'PGK']);

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/tenants/{$target->id}")
            ->assertForbidden();
    }
}
