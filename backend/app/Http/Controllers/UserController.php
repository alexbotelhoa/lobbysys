<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::orderBy('name')->get();

        return response($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:50|required',
            'email' => 'string|email|max:30|unique:users|required',
            'password' => 'string|min:6|required',
            'c_password' => 'same:password|required',
        ]);

        if ($validator->fails()) return response([ 'error' => $validator->errors() ], 422);


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response($user, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::where('id', $id)->delete($id);

        if (!$user) return response(["message" => "User Not Found!"], 404);

        return response('', 204);
    }
}
