<?php

/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid listName length
3 - Invalid listCreator length
4 - List too big
*/

require("globals.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);
$time = new DateTime();

// Cannot connect to database
if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}
$DATA = json_decode(file_get_contents("php://input"), true);

// Invalid listName length
if (strlen($DATA["lName"]) < 3 || strlen($DATA["lName"]) > 40) {
  echo "2";
  exit();
}

// Check list size
$len = strlen($DATA["listData"]);
if ($len > 25000 || $len < 150) {
  echo "4";
  exit();
}

$user_id = checkAccount()["id"];
$diffGuess = $DATA["diffGuesser"] == 1 ? 1 : 0;

// Checking request
error_reporting($debugMode ? -1 : 0);
$fuckupData = sanitizeInput(array($DATA["lName"],$DATA["listData"]));
$timestamp = $time -> getTimestamp();

// Generate id if list private
if ($DATA["hidden"]) { $hidden = privateIDGenerator($fuckupData[1], $fuckupData[0], $timestamp); }
else { $hidden = "0"; }

// Send to database
$teplate = "INSERT INTO `lists`(`creator`,`name`,`data`,`timestamp`,`hidden`,`uid`,`diffGuesser`) VALUES ('',?,?,?,?,?,?)";
$values = array($fuckupData[0], $fuckupData[1], $timestamp, $hidden, $user_id, $diffGuess);
doRequest($mysqli, $teplate, $values, "ssssss");

if ($DATA["hidden"]) {
    // Hidden lists
    $listID = $hidden;
}
else {
    $listIDquery = $mysqli -> query("SELECT LAST_INSERT_ID()");
    $rows = $listIDquery -> fetch_all(MYSQLI_ASSOC);
    foreach ($rows as $row) {
      $listID = join("",$row);
    }
}
$mysqli -> close();

echo json_encode([$listID]);

?>
