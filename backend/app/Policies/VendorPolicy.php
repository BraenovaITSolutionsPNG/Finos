<?php

namespace App\Policies;

use App\Models\Vendor;
use App\Models\User;

class VendorPolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, Vendor $vendor): bool { return $this->owns($vendor, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function update(User $user, Vendor $vendor): bool { return $this->owns($vendor, $user) && $this->editor($user); }

    public function delete(User $user, Vendor $vendor): bool { return $this->owns($vendor, $user) && $this->editor($user); }
}
