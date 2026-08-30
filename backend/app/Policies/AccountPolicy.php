<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, Account $account): bool { return $this->owns($account, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function update(User $user, Account $account): bool { return $this->owns($account, $user) && $this->editor($user); }

    public function delete(User $user, Account $account): bool { return $this->owns($account, $user) && $this->editor($user); }
}
