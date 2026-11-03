# Temporary helper: search Wikimedia Commons for candidate images and write them to a log file.
$ErrorActionPreference = 'Continue'
$ua = 'ChengduSiteBot/1.0 (educational project)'
$out = 'c:\Users\Angse\Desktop\book3\_tools\candidates.txt'
$queries = @(
  'Dujiangyan', 'Wuhou Shrine Chengdu', 'Du Fu Thatched Cottage', 'Mount Qingcheng',
  'Chengdu skyline', 'Chengdu giant panda', 'Jinli Chengdu', 'Chengdu Kuanzhai Alley',
  'Mapo tofu', 'Sichuan hot pot', 'Dan dan noodles', 'Zhong dumplings', 'Fuqi feipian',
  'Chengdu wonton', 'Chengdu video', 'Chengdu Taikoo Li'
)
"START $(Get-Date)" | Out-File $out -Encoding utf8
foreach ($q in $queries) {
  "=== $q" | Out-File $out -Append -Encoding utf8
  try {
    $u = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=12&format=json&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&gsrsearch=' + [uri]::EscapeDataString($q)
    $r = Invoke-RestMethod -Uri $u -UserAgent $ua -TimeoutSec 30
    foreach ($p in $r.query.pages.PSObject.Properties) {
      $v = $p.Value; $ii = $v.imageinfo[0]
      "$($v.title) | $($ii.mime) | $($ii.width)x$($ii.height) | $($ii.thumburl)" | Out-File $out -Append -Encoding utf8
    }
  } catch { "ERR $($_.Exception.Message)" | Out-File $out -Append -Encoding utf8 }
  Start-Sleep -Milliseconds 500
}
"END $(Get-Date)" | Out-File $out -Append -Encoding utf8
