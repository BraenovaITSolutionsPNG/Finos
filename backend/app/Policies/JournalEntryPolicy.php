<?php

namespace App\Policies;

use App\Models\JournalEntry;
use App\Models\User;

class JournalEntryPolicy extends TenantPolicy
{
    public function viewAny(User $user): bool { return $this->viewer($user); }

    public function view(User $user, JournalEntry $entry): bool { return $this->owns($entry, $user); }

    public function create(User $user): bool { return $this->editor($user); }

    public function delete(User $user, JournalEntry $entry): bool { return $this->owns($entry, $user) && $this->editor($user); }
}
