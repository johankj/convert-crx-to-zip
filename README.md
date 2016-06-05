Convert CRX to ZIP
==================

Chrome Extensions (CRX) are ZIP-files with an added header in the form of `magic number + version number + public key length + signature length + public key + signature`<sup>[[1]](https://developer.chrome.com/extensions/crx)</sup>.

This small web app uses the File-api's to calculate the above header-length, skip it, and download it to your computer as a ZIP-file which can then be easily extracted.

Live
----

You can try it for yourself at [https://johankj.github.io/convert-crx-to-zip/](https://johankj.github.io/convert-crx-to-zip/).

License
-------

MIT
