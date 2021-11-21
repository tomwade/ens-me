<form action="" method="get">
	<div class="form-group">
		<label for="contains">ENS Domain Contains</label>
    	<input type="text" name="contains" class="form-control" id="contains" placeholder="" value="<?php echo $_GET['contains']; ?>">
  	</div>

  	<div class="form-group">
		<label for="years">Minimum Years</label>
    	<input type="text" name="years" class="form-control" id="years" placeholder="0" value="<?php echo $_GET['years']; ?>">
  	</div>

  	<button type="submit" class="btn btn-primary">Filter</button>
</form>