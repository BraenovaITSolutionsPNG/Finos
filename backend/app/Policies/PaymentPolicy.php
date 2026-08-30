<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, Payment $payment): bool { return $this->owns($payment, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function delete(User $user, Payment $payment): bool { return $this->owns($payment, $user) && $this->editor($user); }
}
