$hosts = @(
 'https://images.unsplash.com/', 'https://unsplash.com/', 'https://pixabay.com/', 'https://cdn.pixabay.com/',
 'https://www.bing.com/', 'https://image.baidu.com/', 'https://commons.wikimedia.org/', 'https://upload.wikimedia.org/',
 'https://www.pexels.com/', 'https://images.pexels.com/', 'https://picsum.photos/', 'https://www.flickr.com/',
 'https://en.wikipedia.org/', 'https://zh.wikipedia.org/', 'https://baike.baidu.com/', 'https://www.google.com/'
)
$jobs = foreach ($h in $hosts) {
  Start-Job -ArgumentList $h -ScriptBlock {
    param($h)
    $o = & curl.exe -s -o NUL -m 8 -A 'Mozilla/5.0' -w '%{http_code} %{time_total}s' $h 2>&1
    "$h => $o"
  }
}
$jobs | Wait-Job -Timeout 20 | Out-Null
$jobs | ForEach-Object { Receive-Job $_ -ErrorAction SilentlyContinue } | Out-File 'c:\Users\Angse\Desktop\book3\_tools\net2.txt' -Encoding utf8
'finished' | Add-Content 'c:\Users\Angse\Desktop\book3\_tools\net2.txt'
