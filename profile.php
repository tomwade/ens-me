<?php
include('helpers.php');

$tag = $_GET['tag'];

$sUrl = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

$domain_search = '{"query":"{domains(first: 1, where: {name: \"' . $tag . '.eth\", owner_not: null}) { id name labelName labelhash owner { id }}}"}';

$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER,         0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_POST,           1);
curl_setopt($ch, CURLOPT_POSTFIELDS,     $domain_search); 
curl_setopt($ch, CURLOPT_URL,            $sUrl);
$data = curl_exec($ch);
curl_close($ch);

$data = json_decode($data);

$preferences = get_preferences($tag);
?><html prefix="og: https://ogp.me/ns#">
<head>
    <title><?php echo $tag; ?>.eth - ens.me</title>

    <meta property="og:title" content="<?php echo $tag; ?>.eth - ENS.me" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="https://ens.me/<?php echo $tag; ?>.eth" />
    <meta property="og:image" content="https://metadata.ens.domains/mainnet/avatar/<?php echo $tag; ?>.eth" />
    <meta property="profile:username" content="<?php echo $tag; ?>.eth" />
    <meta property="og:description" content="" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="./style.css" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

    <style>
    .content {
        background-color: <?php echo $preferences->style->background; ?>;
    }

    .btn {
        border-color: <?php echo $preferences->style->highlight; ?>;
        color: <?php echo $preferences->style->highlight; ?>;
    }
    </style>

    <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script>
        (function ($) {
            let provider;
            let signer;

            async function load_ens() {
                // A Web3Provider wraps a standard Web3 provider, which is
                // what MetaMask injects as window.ethereum into each page
                try {
                    await window.ethereum.enable();
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    signer = provider.getSigner();

                } catch (error) {
                    provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
                }

                const resolver = await provider.getResolver('<?php echo $tag; ?>.eth');
                if (!resolver) {
                    $('.ens--description').show();
                    $('#unknown').show();
                    $('#known').hide();
                }
                else {
                    const btcAddress = await resolver.getAddress(0);
                    if (btcAddress) {
                        $('.ens--btc .domain__expires').text(btcAddress);
                        $('.ens--btc .domain__actions a').attr('href', 'bitcoin:' + btcAddress);
                        $('.ens--btc').show();
                    }

                    const ethAddress = await resolver.getAddress(60);
                    if (ethAddress) {
                        $('.ens--eth .domain__expires').text(ethAddress);
                        $('.ens--eth .domain__actions a').attr('href', 'https://etherscan.io/' + ethAddress);
                        $('.ens--eth').show();
                    }

                    const ltcAddress = await resolver.getAddress(2);
                    if (ltcAddress) {
                        $('.ens--ltc .domain__expires').text(ltcAddress);
                        $('.ens--ltc .domain__actions a').attr('href', '');
                        $('.ens--ltc').show();
                    }

                    const dogeAddress = await resolver.getAddress(3);
                    if (dogeAddress) {
                        $('.ens--doge .domain__expires').text(dogeAddress);
                        $('.ens--doge .domain__actions a').attr('href', 'https://dogecoin.com/');
                        $('.ens--doge').show();
                    }

                    const email = await resolver.getText("email")
                    if (email) {
                        $('.ens--email .domain__expires').text(email);
                        $('.ens--email .domain__actions a').attr('href', 'mailto:' + email);
                        $('.ens--email').show();
                    }

                    const url = await resolver.getText("url")
                    if (url) {
                        $('.ens--url .domain__expires').text(url);
                        $('.ens--url .domain__actions a').attr('href', url);
                        $('.ens--url').show();
                    }

                    const description = await resolver.getText("description")
                    if (description) {
                        $('.ens--description .domain__expires').text(description);
                        $('meta[name="og:description"]').attr('content', description);
                        $('.ens--description').show();
                    }

                    // const notice = await resolver.getText("notice")
                    // const keywords = await resolver.getText("keywords")

                    const com_discord = await resolver.getText("com.discord")
                    if (com_discord) {
                        $('.ens--discord .domain__expires').text(com_discord);
                        $('.ens--discord .domain__actions a').attr('href', 'https://discord.com');
                        $('.ens--discord').show();
                    }

                    const com_github = await resolver.getText("com.github")
                    if (com_github) {
                        $('.ens--github .domain__expires').text(com_github);
                        $('.ens--github .domain__actions a').attr('href', 'https://github.com/' + com_github);
                        $('.ens--github').show();
                    }

                    const com_reddit = await resolver.getText("com.reddit")
                    if (com_reddit) {
                        $('.ens--com_reddit .domain__expires').text('u/' + com_reddit);
                        $('.ens--com_reddit .domain__actions a').attr('href', 'https://redidt.com/u/' + com_reddit);
                        $('.ens--com_reddit').show();
                    }

                    const com_twitter = await resolver.getText("com.twitter")
                    if (com_twitter) {
                        $('.ens--twitter .domain__expires').text('@' + com_twitter);
                        $('.ens--twitter .domain__actions a').attr('href', 'https://twitter.com/' + com_twitter);
                        $('.ens--twitter').show();
                    }

                    const org_telegram = await resolver.getText("org.telegram")
                    if (org_telegram) {
                        $('.ens--telegram .domain__expires').text(org_telegram);
                        $('.ens--telegram .domain__actions a').attr('href', 'tg://resolve?domain=' + org_telegram);
                        $('.ens--telegram').show();
                    }

                    $('.ens--ens').show();
                }

                $('.loader').addClass('loaded');

                if (signer) {
                    signer.getAddress(60).then((owner_address) => {
                        console.log(owner_address);
                        console.log('<?php echo strtolower($data->data->domains[0]->owner->id); ?>');
                        if (owner_address.toLowerCase() == '<?php echo strtolower($data->data->domains[0]->owner->id); ?>') {
                            $('#edit').fadeIn();
                        }

                        $('#edit').click(function (e) {
                            $('body').addClass('editing');
                        });

                        $('#save').click(function (e) {
                            $.post('./sync.php', {
                                owner: '<?php echo $tag; ?>.eth',
                                ens_data: $('#ens__form').serialize()
                            }, function (data) {
                                location.reload();
                            });
                        });
                    });
                }
            }

            load_ens();
        })(jQuery);
    </script>
</head>
<body>
    <div class="loader">
        <img src="./loader.svg" />
    </div>

    <div id="unknown" style="display: none">
        <?php include('404.php'); ?>
    </div>

    <div id="known">
        <a href="#" id="edit" class="btn btn-edit" style="display: none;">Manage</a>

        <center>
            <h1><?php echo $tag; ?>.eth</h1>
            <h3 class="ens ens--description"></h3>
        </center>

        <form method="" action="" id="ens__form" class="content">
            <div class="avatar__wrapper <?php echo _display($preferences, 'avatar'); ?>">
                <object data="https://metadata.ens.domains/mainnet/avatar/<?php echo $tag; ?>.eth" type="image/jpg" class="avatar ens--avatar">
                    <img src="./default.svg" />
                </object>

                <input type="checkbox" name="ens[avatar]" class="editable domain__toggle" <?php echo _checked($preferences, 'avatar'); ?> />
            </div>

            <div class="domains">
            
                <div class="domain ens ens--eth editable <?php echo _display($preferences, 'eth'); ?>">
                    <input type="checkbox" name="ens[eth]" class="editable domain__toggle" <?php echo _checked($preferences, 'eth'); ?> />

                    <span class="domain__name">ETH</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Send</a>
                    </div>
                </div>

                <div class="domain ens ens--btc editable <?php echo _display($preferences, 'btc'); ?>">
                    <input type="checkbox" name="ens[btc]" class="editable domain__toggle" <?php echo _checked($preferences, 'btc'); ?> />

                    <span class="domain__name">BTC</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Send</a>
                    </div>
                </div>

                <div class="domain ens ens--ltc editable <?php echo _display($preferences, 'ltc'); ?>">
                    <input type="checkbox" name="ens[ltc]" class="editable domain__toggle" <?php echo _checked($preferences, 'ltc'); ?> />

                    <span class="domain__name">LTC</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Send</a>
                    </div>
                </div>

                <div class="domain ens ens--doge editable <?php echo _display($preferences, 'doge'); ?>">
                    <input type="checkbox" name="ens[doge]" class="editable domain__toggle" <?php echo _checked($preferences, 'doge'); ?> />

                    <span class="domain__name">DOGE</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Send</a>
                    </div>
                </div>

                <div class="domain ens ens--url editable <?php echo _display($preferences, 'website'); ?>">
                    <input type="checkbox" name="ens[website]" class="editable domain__toggle" <?php echo _checked($preferences, 'website'); ?> />

                    <span class="domain__name">Website</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Visit</a>
                    </div>
                </div>

                <div class="domain ens ens--email editable <?php echo _display($preferences, 'email'); ?>">
                    <input type="checkbox" name="ens[email]" class="editable domain__toggle" <?php echo _checked($preferences, 'email'); ?> />

                    <span class="domain__name">Email</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Email me</a>
                    </div>
                </div>

                <div class="domain ens ens--twitter editable <?php echo _display($preferences, 'twitter'); ?>">
                    <input type="checkbox" name="ens[twitter]" class="editable domain__toggle" <?php echo _checked($preferences, 'twitter'); ?> />

                    <span class="domain__name">Twitter</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Follow me</a>
                    </div>
                </div>

                <div class="domain ens ens--github editable <?php echo _display($preferences, 'github'); ?>">
                    <input type="checkbox" name="ens[github]" class="editable domain__toggle" <?php echo _checked($preferences, 'github'); ?> />

                    <span class="domain__name">Github</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Visit</a>
                    </div>
                </div>

                <div class="domain ens ens--discord editable <?php echo _display($preferences, 'discord'); ?>">
                    <input type="checkbox" name="ens[discord]" class="editable domain__toggle" <?php echo _checked($preferences, 'discord'); ?> />

                    <span class="domain__name">Discord</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Join me</a>
                    </div>
                </div>

                <div class="domain ens ens--reddit editable <?php echo _display($preferences, 'reddit'); ?>">
                    <input type="checkbox" name="ens[reddit]" class="editable domain__toggle" <?php echo _checked($preferences, 'reddit'); ?> />

                    <span class="domain__name">Reddit</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Follow me</a>
                    </div>
                </div>

                <div class="domain ens ens--telegram editable <?php echo _display($preferences, 'telegram'); ?>">
                    <input type="checkbox" name="ens[telegram]" class="editable domain__toggle" <?php echo _checked($preferences, 'telegram'); ?> />

                    <span class="domain__name">Telegram</span>
                    <span class="domain__expires"></span>

                    <div class="domain__actions">
                        <a href="#" target="_blank" class="btn">Join me</a>
                    </div>
                </div>

                <div class="domain ens--ens editable <?php echo _display($preferences, 'ens'); ?>">
                    <input type="checkbox" name="ens[ens]" class="editable domain__toggle" <?php echo _checked($preferences, 'ens'); ?> />

                    <span class="domain__name">ENS</span>
                    <span class="domain__expires"><?php echo $tag; ?>.eth</span>

                    <div class="domain__actions">
                        <a href="https://app.ens.domains/name/<?php echo $tag; ?>.eth" target="_blank" class="btn">Visit ENS</a>
                    </div>
                </div>

                <div class="domain editable">
                    <span class="domain__name">Background Color</span>
                    <span class="domain__expires"></span>
                    <div class="domain__actions">
                        <input type="color" name="style[background]" value="<?php echo $preferences->style->background; ?>" />
                    </div>
                </div>

                <div class="domain editable">
                    <span class="domain__name">Highlight Color</span>
                    <span class="domain__expires"></span>
                    <div class="domain__actions">
                        <input type="color" name="style[highlight]" value="<?php echo $preferences->style->highlight; ?>" />
                    </div>
                </div>

                <div id="save" class="domain domain__save editable">Update Profile</div>

            </div>
        </div>
    </form>
</body>
</html>