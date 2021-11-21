<?php
function domain_status($timestamp) {
	if ($timestamp + (60 * 60 * 24 * 90) < time()) {
		return 'available';
	}
	else if ($timestamp < time()) {
		return 'grace';
	}

	return 'unavailable';
}

function grace_period() {
	return time() - (60 * 60 * 24 * 90);
}

function api_uri() {
	return 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';
}

function recently_expired() {
	$contains = $_GET['contains'] ?? '';
	$registered_from = ($_GET['years']) ? time() - (60 * 60 * 24 * 365.25 * $_GET['years']) : 999999999999;

	$grace_period = grace_period();

	// Already expired
	$expired_graph = '{"query":"{registrations(orderBy: expiryDate, orderDirection: desc, first: 250, where: {expiryDate_lt: ' . $grace_period . ', labelName_contains: \"' . $contains . '\", registrationDate_lte: \"' . $registered_from . '\"}) {expiryDate registrationDate domain {name owner {id} events { __typename }}}}"}';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER,         0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_POST,           1);
	curl_setopt($ch, CURLOPT_POSTFIELDS,     $expired_graph); 
	curl_setopt($ch, CURLOPT_URL,            api_uri());
	$data = curl_exec($ch);
	curl_close($ch);

	$domains = json_decode($data);
	return $domains->data->registrations;
}

function expiring_soon() {
	$contains = $_GET['contains'] ?? '';
	$registered_from = ($_GET['years']) ? time() - (60 * 60 * 24 * 365.25 * $_GET['years']) : 999999999999;
	$max_expiry = time() + (60 * 60 * 24 * 365.25);

	$grace_period = grace_period();

	// 90 days grace period
	$expiring_soon_graph = '{"query":"{registrations(orderBy: expiryDate, orderDirection: asc, first: 250, where: {expiryDate_gt: ' . $grace_period . ', expiryDate_lt: ' . $max_expiry . ', labelName_contains: \"' . $contains . '\", registrationDate_lte: \"' . $registered_from . '\"}) {expiryDate registrationDate domain {name owner {id} events { __typename }}}}"}';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER,         0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_POST,           1);
	curl_setopt($ch, CURLOPT_POSTFIELDS,     $expiring_soon_graph); 
	curl_setopt($ch, CURLOPT_URL,            api_uri());
	$data = curl_exec($ch);
	curl_close($ch);

	$domains = json_decode($data);
	return $domains->data->registrations;
}

function sum_events($event_name, $events) {
	$total = 0;
	foreach ($events as $event) {
		if ($event->__typename == $event_name) {
			++$total;
		}
	}

	return $total;
}