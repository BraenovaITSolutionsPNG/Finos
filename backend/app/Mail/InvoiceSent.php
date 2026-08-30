<?php

namespace App\Mail;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceSent extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Invoice $invoice, public array $business = [])
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice '.$this->invoice->number.' from '.($this->business['company_name'] ?? 'FinOS'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice-sent',
            with: ['invoice' => $this->invoice, 'business' => $this->business],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(
                fn () => Pdf::loadView('invoices.pdf', [
                    'invoice' => $this->invoice,
                    'business' => $this->business,
                ])->output(),
                'invoice-'.$this->invoice->number.'.pdf',
                ['mime' => 'application/pdf'],
            ),
        ];
    }
}
