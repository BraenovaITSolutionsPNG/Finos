<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        $notes = Notification::where('tenant_id', $tenant->id)
            ->where(function ($q) {
                $q->whereNull('user_id')->orWhere('user_id', auth()->id());
            })
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json(NotificationResource::collection($notes));
    }

    public function unreadCount(): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        $count = Notification::where('tenant_id', $tenant->id)
            ->whereNull('read_at')
            ->where(function ($q) {
                $q->whereNull('user_id')->orWhere('user_id', auth()->id());
            })
            ->count();

        return response()->json(['count' => $count]);
    }

    public function markRead(Notification $notification): JsonResponse
    {
        $notification->markAsRead();

        return response()->json(new NotificationResource($notification));
    }

    public function markAllRead(): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        Notification::where('tenant_id', $tenant->id)
            ->whereNull('read_at')
            ->where(function ($q) {
                $q->whereNull('user_id')->orWhere('user_id', auth()->id());
            })
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
