<?php

namespace App\Enums;

enum Role: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case MEMBER = 'member';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::OWNER => 'Owner',
            self::ADMIN => 'Administrator',
            self::MANAGER => 'Manager',
            self::MEMBER => 'Member',
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            self::OWNER => [
                'tenant:view', 'tenant:update', 'tenant:delete',
                'member:view', 'member:invite', 'member:update', 'member:remove',
                'billing:manage', 'settings:manage',
                'finance:view', 'finance:create', 'finance:approve',
            ],
            self::ADMIN => [
                'tenant:view', 'tenant:update',
                'member:view', 'member:invite', 'member:update', 'member:remove',
                'settings:manage',
                'finance:view', 'finance:create', 'finance:approve',
            ],
            self::MANAGER => [
                'tenant:view',
                'member:view',
                'finance:view', 'finance:create', 'finance:approve',
            ],
            self::MEMBER => [
                'tenant:view',
                'member:view',
                'finance:view', 'finance:create',
            ],
        };
    }

    public function can(string $ability): bool
    {
        return in_array($ability, $this->permissions(), true);
    }

    public static function fromValue(string $value): self
    {
        return self::from($value);
    }
}
