<?php
/*
Return codes:
*/
header('Content-type: application/json'); // Return as JSON
require_once("globals.php");

function createNotification($mysqli, $from, $to, $type, $postType, $objectID, $otherID = null) {
    // objectID: 0 - comment, 1 - rating, 2 - other
    // postType: 0 - list, 1 - review, 2 - other
    // if ($from == $to) return // Do not send notifications to yourself

    $res = doRequest($mysqli,
              "INSERT INTO `notifications`(`to_user`, `from_user`, `type`, `postType`, `objectID`, `otherID`) VALUES (?,?,?,?,?,?)",
              [$to, $from, $type, $postType, $objectID, $otherID],
              "ssiiii");
}

function deleteNotification($mysqli, $toUID, $postType, $objectID) {
    $res = doRequest($mysqli,
              "DELETE FROM `notifications` WHERE `unread`=1 AND `to_user`=? AND `type`=? AND `objectID`=?",
              [$toUID, $postType, $objectID], "sii");
}

if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    $mysqli = new mysqli($hostname, $username, $password, $database);
    if ($mysqli -> connect_errno) {
        die("0");
    };

    $acc = checkAccount($mysqli);
    $method = $_SERVER["REQUEST_METHOD"];
    switch ($method) {
        case 'GET':
            $notifs = doRequest($mysqli, "SELECT tTo.username as 'from', tFrom.username as 'to', `to_user`, `id`, `type`, `unread`, `time`, `postType`, `objectID`, `otherID`
             FROM `notifications` n
             LEFT JOIN `users` tTo on n.to_user = tTo.discord_id
             LEFT JOIN `users` tFrom on n.from_user = tFrom.discord_id
             WHERE `to_user`=?
             ORDER BY `time` DESC
             LIMIT 20", [$acc["id"]], "s", true);

            $postIDs = [[], []];
            foreach ($notifs as $n) {
                array_push($postIDs[intval($n["postType"] == 'review')], $n["objectID"]);
            }

            $postNames = doRequest($mysqli, sprintf("SELECT `name`,`id`, '0' as type
            FROM lists where id in (%s)
            UNION SELECT name,id,1
            FROM reviews WHERE id in (%s)", implode(",", $postIDs[0]), implode(",", $postIDs[1])), [], "", true);

            echo json_encode([$notifs, $postNames]);
            break;
        case 'DELETE':
            doRequest($mysqli, "DELETE FROM `notifications` WHERE `to_user`=?", [$acc["id"]], "s");
            break;
        default:
            die("-1");
            break;
    }

}

?>
