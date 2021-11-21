<?php
function _active($preferences, $field) {
	return ($preferences->display->$field == true);
}

function _checked($preferences, $field) {
	if (!_active($preferences, $field)) {
		return '';
	}

	return 'checked';
}

function _display($preferences, $field) {
	if (!_active($preferences, $field)) {
		return 'hidden';
	}

	return '';
}

function get_preferences($tag) {
	$curl = curl_init();

	curl_setopt_array($curl, [
	  CURLOPT_URL 			 => 'https://api.pinata.cloud/data/pinList?metadata[name]=' . $tag . '.eth',
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING 		 => '',
	  CURLOPT_MAXREDIRS 	 => 10,
	  CURLOPT_TIMEOUT 		 => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST  => 'GET',
	  CURLOPT_SSL_VERIFYPEER => 0,
	  CURLOPT_HTTPHEADER     => [
	    'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NmQzNjFhZS03NDFjLTQ1ZDAtYjJiMS0zMjU0ODFjNjQyYTQiLCJlbWFpbCI6ImhlbGxvQHR3YWRlLmNvLnVrIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjhmNDJlMGY3ZGFjNWVhMzkyODU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDk0MDU4NmE0MDk5ZDlhYzlhYmQ2YzJjNjllN2ZlOGE2Yjg0NjgzYjlkYzEyMTA5NjdkYTRlNzVlZTZhZDM3NCIsImlhdCI6MTYzNjk4MjQwMn0.J7EQ_gHSVOe3NoPkJYfpZcwFd42Jpo8I3BXRlxIx6oI',
	    'Content-Type: application/json'
	  ],
	]);

	$response = curl_exec($curl);
	$response = json_decode($response);

	curl_close($curl);

	$default_data = [
		'display' => [
			'avatar' => true,
			'eth' => true,
			'btc' => true,
			'ltc' => true,
			'doge' => true,
			'website' => true,
			'email' => true,
			'twitter' => true,
			'github' => true,
			'discord' => true,
			'reddit' => true,
			'telegram' => true,
			'ens' => true,
		],
		'style' => [
			'background' => '#f7f7f7',
			'highlight' => '#049b4a',
		]
	];

	if (!$response || $response->count == 0) {
		return json_decode(json_encode($default_data));
	}

	foreach ($response->rows as $row) {
		if ($row->date_unpinned) {
			continue;
		}

		return json_decode(file_get_contents('https://gateway.pinata.cloud/ipfs/' . $row->ipfs_pin_hash));
	}

	return json_decode(json_encode($default_data));
}