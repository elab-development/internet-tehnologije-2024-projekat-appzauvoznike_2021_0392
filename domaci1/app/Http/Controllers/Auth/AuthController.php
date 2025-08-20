<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Company;

class AuthController extends Controller
{
    /**
     * Registracija korisnika
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|unique:users',
            'password'   => 'required|string|min:6',
            'phone'      => 'nullable|string',
            'role'       => 'required|in:admin,importer,supplier',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('company'),
            'token' => $token,
        ], 201);
    }

    /**
     * Login korisnika
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load([
                'company',
                'company.products',
                'company.offers',
                'company.containers',
            ]),
            'token' => $token,
        ]);
    }

    /**
     * Vraća podatke o ulogovanom korisniku
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json(
            $user->load([
                'company',
                'company.products',
                'company.offers.items.product',
                'company.containers.items.offerItem.product',
            ])
        );
    }

    /**
     * Logout korisnika
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
