<html>
<head>
	<title>Domains Expiring Soon - ens.me</title>

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

	<link href="./style.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
</head>
<body>
	<h1>Expiring Domains</h1>

	<div class="content">
		<div class="domains domains--expiring">
			<?php
			require_once('helpers.php');
			$domains = expiring_soon();

			if ($domains) {
				foreach ($domains as $domain) {
					if (preg_match('/\[/', $domain->domain->name)) {
						continue;
					}

					include('domain.php');
				}
			} else {
				echo '<h3>No domains found.</h3>';
			}
			?>
		</div>

		<div class="sidebar">
			<a href="./index.php" class="tab tab--active">⏰ Expiring Soon</a>
			<a href="./expired.php" class="tab">👋 Recently Expired</a>

			<div class="tab">
				<?php include('filters.php'); ?>
			</div>
		</div>
	</div>

</body>
</html>