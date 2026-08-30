<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }
    public function view(User $user, Employee $m): bool { return $this->owns($m, $user); }
    public function create(User $user): bool { return $this->editor($user); }
    public function update(User $user, Employee $m): bool { return $this->owns($m, $user) && $this->editor($user); }
    public function delete(User $user, Employee $m): bool { return $this->owns($m, $user) && $this->editor($user); }
}
