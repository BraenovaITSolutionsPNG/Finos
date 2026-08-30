<?php

namespace App\Policies;

use App\Models\TaxRate;
use App\Models\User;

class TaxRatePolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }
    public function view(User $user, TaxRate $m): bool { return $this->owns($m, $user); }
    public function create(User $user): bool { return $this->editor($user); }
    public function update(User $user, TaxRate $m): bool { return $this->owns($m, $user) && $this->editor($user); }
    public function delete(User $user, TaxRate $m): bool { return $this->owns($m, $user) && $this->editor($user); }
}
