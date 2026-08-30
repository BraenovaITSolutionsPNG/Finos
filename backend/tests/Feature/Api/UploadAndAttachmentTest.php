<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadAndAttachmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\PlansSeeder::class);
    }

    protected function auth(array $overrides = []): string
    {
        $res = $this->postJson('/api/auth/register', array_merge([
            'name' => 'Owner',
            'email' => 'owner'.uniqid().'@finos.pg',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'tenant_name' => 'Co '.uniqid(),
            'country' => 'PG',
            'currency' => 'PGK',
        ], $overrides));

        return $res->json('token');
    }

    public function test_upload_stores_file_and_returns_public_url(): void
    {
        Storage::fake('public');
        $token = $this->auth();

        $response = $this->withToken($token)->postJson('/api/upload', [
            'file' => UploadedFile::fake()->create('receipt.pdf', 20, 'application/pdf'),
            'folder' => 'uploads',
        ]);

        $response->assertStatus(201);
        $url = $response->json('url');
        $this->assertStringContainsString('/files/', $url);

        $path = substr($url, strpos($url, '/files/') + strlen('/files/'));
        Storage::disk('public')->assertExists($path);
    }

    public function test_invoice_persists_attachment_url(): void
    {
        $token = $this->auth();
        $customer = $this->withToken($token)->postJson('/api/customers', ['name' => 'Client'])->json('id');

        $url = 'http://127.0.0.1:8000/files/uploads/1/sample.pdf';
        $created = $this->withToken($token)->postJson('/api/invoices', [
            'customer_id' => $customer,
            'number' => 'INV-ATT',
            'issue_date' => '2026-08-30',
            'status' => 'sent',
            'attachment_url' => $url,
            'items' => [['description' => 'Service', 'quantity' => 1, 'unit_price' => 500, 'tax_rate' => 0]],
        ])->assertStatus(201)->json();

        $this->assertEquals($url, $created['attachment_url']);
        $this->assertDatabaseHas('invoices', ['number' => 'INV-ATT', 'attachment_url' => $url]);

        $detail = $this->withToken($token)->getJson("/api/invoices/{$created['id']}")->json();
        $this->assertEquals($url, $detail['attachment_url']);
    }
}
