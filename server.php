<?php 

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = file_get_contents("php://input");
        $file = fopen("data.json", "w");
        $json = json_decode($_POST['score']);
        
        if (flock($file, LOCK_EX)) {
            fwrite($file, $data);
            flock($file, LOCK_UN);
        }

        fclose($file);

    } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
        $data = file_get_contents("data.json");

        if (filesize("data.json") != 0) {
            echo $data;
        } else {
            echo json_encode([]);
        }
    }
?>