<?php

namespace Tests\Feature\Api;

use App\Mail\InvoiceSent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;

class MailAndPdfTest extends TestCase
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

    public function test_sending_invoice_emails_customer(): void
    {
        Mail::fake();
        $token = $this->auth();
        $customer = $this->withToken($token)->postJson('/api/customers', [
            'name' => 'Client',
            'email' => 'client@example.com',
        ])->json('id');

        $invoiceId = $this->withToken($token)->postJson('/api/invoices', [
            'customer_id' => $customer,
            'number' => 'INV-MAIL',
            'issue_date' => '2026-08-30',
            'status' => 'sent',
            'items' => [['description' => 'Service', 'quantity' => 1, 'unit_price' => 500, 'tax_rate' => 0]],
        ])->json('id');

        $this->withToken($token)->postJson("/api/invoices/{$invoiceId}/send")
            ->assertStatus(200)
            ->assertJsonFragment(['sent_to' => 'client@example.com']);

        Mail::assertSent(InvoiceSent::class, fn (InvoiceSent $m) => $m->hasTo('client@example.com'));
    }

    public function test_invoice_pdf_download_returns_pdf(): void
    {
        $token = $this->auth();
        $customer = $this->withToken($token)->postJson('/api/customers', ['name' => 'Client'])->json('id');
        $invoiceId = $this->withToken($token)->postJson('/api/invoices', [
            'customer_id' => $customer,
            'number' => 'INV-PDF',
            'issue_date' => '2026-08-30',
            'status' => 'sent',
            'items' => [['description' => 'Service', 'quantity' => 2, 'unit_price' => 250, 'tax_rate' => 0]],
        ])->json('id');

        $response = $this->withToken($token)->get("/api/invoices/{$invoiceId}/pdf");
        $response->assertOk();
        $this->assertStringContainsString('application/pdf', $response->headers->get('content-type'));
        $this->assertTrue(Str::startsWith($response->getContent(), '%PDF'));
    }
}
