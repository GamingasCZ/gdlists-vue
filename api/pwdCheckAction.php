<?php
/*
Return codes:
0 - Error connecting to database
1 - Empty/incomplete request
2 - Incorrect password
3 - List needs password
4 - Success!!
*/

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: authorization,content-type');
require("globals.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli -> connect_errno) {
    echo "0";
    //http_response_code(500);
    exit();
}

error_reporting(0);

$DATA = json_decode(file_get_contents("php://input"), true);

if (isset($DATA["id"])) {
    $listType = Array($DATA["id"], is_numeric($DATA["id"]) ? "id" : "hidden");
}
else {
    echo "1";
    http_response_code(204);
    exit();
}
$datacheck = sanitizeInput([$listType[0]]);

$listData = doRequest($mysqli, sprintf("SELECT * FROM `lists` WHERE `%s`= ?", $listType[1]), [$datacheck[0]], "s");

$owner = checkListOwnership($mysqli, $listData["uid"]);
if ($owner) {
    $listData["data"] = json_decode(htmlspecialchars_decode($listData["data"]));
    echo json_encode($listData);
}
?>
