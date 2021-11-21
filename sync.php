<?php
$owner    = $_POST['owner'];
$ens_data = [];
parse_str($_POST['ens_data'], $ens_data);

$data = [
    'pinataOptions' => [
        'cidVersion' => 1,
    ],
    /* The "pinataMetadata" object will not be part of your content added to IPFS */
    /* Pinata simply stores the metadata provided to help you easily query your JSON object pins */
    'pinataMetadata' => [
        'name' => $owner,
    ],
    /* The contents of the "pinataContent" object will be added to IPFS */
    /* The hash provided back will only represent the JSON contained in this object */
    /* The JSON the returned hash links to will NOT contain the "pinataMetadata" object above */
    'pinataContent' => [
    	'display' => [
	    	'avatar' 	=> array_key_exists('avatar', $ens_data['ens']),
	        'eth' 		=> array_key_exists('eth', $ens_data['ens']),
	        'btc' 		=> array_key_exists('btc', $ens_data['ens']),
	        'ltc' 		=> array_key_exists('ltc', $ens_data['ens']),
	        'doge' 		=> array_key_exists('doge', $ens_data['ens']),
	        'website' 	=> array_key_exists('website', $ens_data['ens']),
	        'email' 	=> array_key_exists('email', $ens_data['ens']),
	        'twitter' 	=> array_key_exists('twitter', $ens_data['ens']),
	        'github' 	=> array_key_exists('github', $ens_data['ens']),
	        'discord' 	=> array_key_exists('discord', $ens_data['ens']),
	        'reddit' 	=> array_key_exists('reddit', $ens_data['ens']),
	        'telegram' 	=> array_key_exists('telegram', $ens_data['ens']),
	        'ens' 		=> array_key_exists('ens', $ens_data['ens']),
		],
		'style' => [
			'background' => $ens_data['style']['background'],
			'highlight'  => $ens_data['style']['highlight'],
		],
    ]
];

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_SSL_VERIFYPEER => 0,
  CURLOPT_POSTFIELDS => json_encode($data),
  CURLOPT_HTTPHEADER => [
    'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NmQzNjFhZS03NDFjLTQ1ZDAtYjJiMS0zMjU0ODFjNjQyYTQiLCJlbWFpbCI6ImhlbGxvQHR3YWRlLmNvLnVrIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjhmNDJlMGY3ZGFjNWVhMzkyODU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDk0MDU4NmE0MDk5ZDlhYzlhYmQ2YzJjNjllN2ZlOGE2Yjg0NjgzYjlkYzEyMTA5NjdkYTRlNzVlZTZhZDM3NCIsImlhdCI6MTYzNjk4MjQwMn0.J7EQ_gHSVOe3NoPkJYfpZcwFd42Jpo8I3BXRlxIx6oI',
    'Content-Type: application/json'
  ],
]);

$response = curl_exec($curl);

curl_close($curl);
