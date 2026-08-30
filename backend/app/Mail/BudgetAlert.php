<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BudgetAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $overBudget, public array $business = [])
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Budget alert: '.count($this->overBudget).' account(s) over budget',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.budget-alert',
            with: ['overBudget' => $this->overBudget, 'business' => $this->business],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
