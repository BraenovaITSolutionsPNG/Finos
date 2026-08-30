<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, Invoice $invoice): bool { return $this->owns($invoice, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function update(User $user, Invoice $invoice): bool { return $this->owns($invoice, $user) && $this->editor($user); }

    public function delete(User $user, Invoice $invoice): bool { return $this->owns($invoice, $user) && $this->editor($user); }
}
