<?php
include('helpers.php');

header('Content-Type: application/json; charset=utf-8');
echo json_encode(get_preferences($_GET['tag']));
die;
