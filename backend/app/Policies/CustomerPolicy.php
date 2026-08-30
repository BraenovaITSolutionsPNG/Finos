<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, Customer $customer): bool { return $this->owns($customer, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function update(User $user, Customer $customer): bool { return $this->owns($customer, $user) && $this->editor($user); }

    public function delete(User $user, Customer $customer): bool { return $this->owns($customer, $user) && $this->editor($user); }
}
