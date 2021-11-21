<div class="domain domain--<?php echo domain_status($domain->expiryDate); ?>">
	<div class="domain__stats">
		<span class="domain__stat domain__lifespan">
			<span class="icon">🎂</span>
			<?php echo round(($domain->expiryDate - $domain->registrationDate) / (3600 * 24 * 365.25), 2); ?> year(s)
		</span>
		<span class="domain__stat domain__transactions">
			<span class="icon">💰</span>
			<?php echo sum_events('Transfer', $domain->domain->events); ?> transfer(s)
		</span>
		<span class="domain__stat domain__transfers">
			<span class="icon">🔁</span>
			<?php echo sum_events('NewOwner', $domain->domain->events); ?> previous owner(s)
		</span>
	</div>

	<span class="domain__name"><?php echo $domain->domain->name; ?></span>
	<span class="domain__expires">
		<?php
		$days_left = floor(($domain->expiryDate - grace_period()) / (60 * 60 * 24));

		if ($days_left == -1) {
			echo 'Expired yesterday';
		}
		elseif ($days_left < 0) {
			echo 'Expired ' . abs($days_left) . ' days ago';
		}
		elseif ($days_left == 0) {
			echo 'Expires today';
		}
		else if ($days_left == 1) {
			echo 'Expires tomorrow';
		}
		else {
			echo 'Expires in ' . $days_left . ' days';
		}
		?>
	</span>

	<div class="domain__actions">
		<a href="https://app.ens.domains/name/<?php echo $domain->domain->name; ?>/details" target="_blank" class="btn">View on ENS</a>
	</div>
</div>