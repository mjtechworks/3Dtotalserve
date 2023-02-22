<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Furnitures;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Log;

class FurnitureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        /**
         *
         * here
         *
         */
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createfurniture(Request $request)
    {

        $data = $request->all();


        $funiturename = FurnitureController::generateRandomString(20).'.json';

        $position = $data['position'];

        $fp = fopen($funiturename , 'w');
        fwrite($fp, json_encode($position));
        fclose($fp);

        DB::table('furnitures')->insert(
            [
            'userid' => $data['userid'],
            'furnitureid' => $funiturename,
            'createdAt' => now(),
            'updatedAt' => now(),
            ]);

        return response()->json([
            "response" => true,
            "message" => "success"
        ]);

    }

    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getFurniture($userid)
    {

        $furnitures = DB::table('furnitures')->where(
            [
            'userid' => (int)$userid,
            ])->get();
        return response() -> json([
            "response"=> true,
            "furniture"=> $furnitures,
            "userid" => (int)$userid
        ]);

    }

    public function getfurnituredetail($userid, Request $request)
    {
        $data = $request->all();

        $furniture = DB::table('furnitures')->where(
            [
            'userid' => (int)$userid,
            'furnitureid' => $data['furnitureid']
            ])->first();

        if (empty($furniture)) {
            return response() -> json([
                "response"=> false,
            ]);
        } else {
            $filename = (string)($furniture->furnitureid);

            if (file_exists($filename)) {

                $furnitures = file_get_contents($filename);
                $array = json_decode($furnitures, true);

                return response() -> json([
                    "response"=> true,
                    "furniture"=> $array
                ]);

            } else {
                return response() -> json([
                    "response"=> false,
                    "message"=> "file does not exist"
                ]);
            }

            // $furnitures = file_get_contents($filename);
            // $array = json_decode($furnitures, true);

            // return response() -> json([
            //     "response"=> true,
            //     "furniture"=> $array
            // ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatefurniture(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
    }
}
