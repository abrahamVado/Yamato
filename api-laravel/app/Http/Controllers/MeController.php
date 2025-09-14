<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class MeController extends Controller {
  public function show(Request $r) { return ['user'=>$r->user()]; }
}
