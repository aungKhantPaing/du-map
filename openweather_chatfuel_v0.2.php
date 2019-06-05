<?php
    $lat = $_GET["lat"];
    $lon = $_GET["lon"];
    $encoded_openweather_JSON = file_get_contents("http://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&APPID=49e0c7f13ecf2f7dbd6563d1f20debff", true);

    $decoded_openweather_JSON = json_decode($encoded_openweather_JSON, true);

    // getting data from openweather_JSON
    $temp = $decoded_openweather_JSON['main']['temp'];
    $temp_min = $decoded_openweather_JSON['main']['temp_min'];
    $temp_max = $decoded_openweather_JSON['main']['temp_max'];
    $pressure = $decoded_openweather_JSON['main']['pressure'];
    $humidity = $decoded_openweather_JSON['main']['humidity'];
    $windSpeed = $decoded_openweather_JSON['wind']['speed'];
    $windDir = $decoded_openweather_JSON['wind']['deg'];
    $description = $decoded_openweather_JSON['weather']['0']['description'];
    $placeName = $decoded_openweather_JSON['name'];

    // setting prefered temperature unit
    if ($_GET['tempUnit'] == "c"){
        $temp = to_C($temp);
        $temp_min = to_C($temp_min);
        $temp_max = to_C($temp_max);
    }
    else if ($_GET['tempUnit'] == "f"){
        $temp = to_F($temp);
        $temp_min = to_F($temp_min);
        $temp_max = to_F($temp_max);
    }// else -> temperature unit will be set default in Kelvin (K)

    function to_C ($temp_K){
        return $temp_K - 273.15;
    }

    function to_F ($temp_K){
        return (6 * 9/5) + 32;
    }

    // JSON to set attribute values in Chatfuel
    $json_4_Chatfuel = '{
        "set_attributes": {
            "temp": "",
            "pressure": "",
            "humidity": "",
            "temp_min": "",
            "temp_max": "",
            "windSpeed": "",
            "windDir": "",
            "description": "",
            "placeName": ""
        }
    }';

    $decoded_json_4_Chatfuel = json_decode($json_4_Chatfuel, true);
    // setting values
    $decoded_json_4_Chatfuel['set_attributes']['temp'] = $temp;
    $decoded_json_4_Chatfuel['set_attributes']['pressure'] = $pressure;
    $decoded_json_4_Chatfuel['set_attributes']['humidity'] = $humidity;
    $decoded_json_4_Chatfuel['set_attributes']['temp_min'] = $temp_min;
    $decoded_json_4_Chatfuel['set_attributes']['temp_max'] = $temp_max;
    $decoded_json_4_Chatfuel['set_attributes']['windSpeed'] = $windSpeed;
    $decoded_json_4_Chatfuel['set_attributes']['windDir'] = $windDir;
    $decoded_json_4_Chatfuel['set_attributes']['description'] = $description;
    $decoded_json_4_Chatfuel['set_attributes']['placeName'] = $placeName;

    echo json_encode($decoded_json_4_Chatfuel);
?>
