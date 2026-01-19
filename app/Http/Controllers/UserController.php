<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('users/index', [
            'users' => User::all(['id', 'name', 'email', 'role', 'created_at'])
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back();
    }
}
