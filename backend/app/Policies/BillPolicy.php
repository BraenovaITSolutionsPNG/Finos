<?php

namespace App\Policies;

use App\Models\Bill;
use App\Models\User;

class BillPolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, Bill $bill): bool { return $this->owns($bill, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function update(User $user, Bill $bill): bool { return $this->owns($bill, $user) && $this->editor($user); }

    public function delete(User $user, Bill $bill): bool { return $this->owns($bill, $user) && $this->editor($user); }
}
