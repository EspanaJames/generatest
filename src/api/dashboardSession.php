<?php
session_start();

$input = json_decode(file_get_contents("php://input"), true);

if (isset($input["username"])) {
    $_SESSION["username"] = $input["username"];
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "No username provided"]);
}
?>
