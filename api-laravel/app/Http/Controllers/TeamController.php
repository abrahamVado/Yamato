<?php
namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $r)
    {
        return Team::where('owner_id', $r->user()->id)->orderBy('id','desc')->paginate(10);
    }

    public function store(Request $r)
    {
        $data = $r->validate(['name'=>'required|string|min:2']);
        $team = Team::create(['name'=>$data['name'], 'owner_id'=>$r->user()->id]);
        return response()->json($team, 201);
    }

    public function show(Request $r, Team $team)
    {
        $this->authorize('view', $team);
        return $team;
    }

    public function update(Request $r, Team $team)
    {
        $this->authorize('update', $team);
        $data = $r->validate(['name'=>'required|string|min:2']);
        $team->update($data);
        return $team;
    }

    public function destroy(Request $r, Team $team)
    {
        $this->authorize('delete', $team);
        $team->delete();
        return response()->noContent();
    }
}
