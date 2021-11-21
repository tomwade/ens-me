<center>
    <h1><?php echo $tag; ?>.eth</h1>
    <h3 class="ens ens--description">Unable to find this profile on mainnet</h3>
</center>

<div class="content">
    <object data="https://metadata.ens.domains/mainnet/avatar/<?php echo $tag; ?>.eth" type="image/jpg" class="avatar ens--avatar">
        <img src="./default.svg" />
    </object>

    <div class="domains">

        <div class="domain ens--ens">
            <span class="domain__name">ENS</span>
            <span class="domain__expires">Register <?php echo $tag; ?></span>

            <div class="domain__actions">
                <a href="https://app.ens.domains/name/<?php echo $tag; ?>.eth" target="_blank" class="btn">Register on ENS</a>
            </div>
        </div>

    </div>
</div>