<?php

namespace App\Mail;

use App\Models\PayrollRun;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayrollProcessed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PayrollRun $run, public array $business = [])
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payroll run processed ('.$this->run->period_start.' to '.$this->run->period_end.')',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payroll-processed',
            with: ['run' => $this->run, 'business' => $this->business],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
