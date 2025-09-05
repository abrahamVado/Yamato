<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $r) {
        $data = $r->validate([
            'name'=>'required',
            'email'=>'required|email|unique:users',
            'password'=>[ 'required', Password::min(8) ],
        ]);
        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
        ]);
        Auth::login($user);
        $r->session()->regenerate();
        return response()->json(['user'=>$user], 201);
    }
    public function login(Request $r) {
        $cred = $r->validate(['email'=>'required|email','password'=>'required']);
        if (!Auth::attempt($cred, true)) return response()->json(['message'=>'Invalid credentials'], 422);
        $r->session()->regenerate();
        return response()->json(['user'=>Auth::user()]);
    }
    public function logout(Request $r) {
        Auth::guard('web')->logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();
        return response()->json(['ok'=>true]);
    }
}
