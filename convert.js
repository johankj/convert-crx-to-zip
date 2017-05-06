var form = document.querySelector('.box');
var submit = form.querySelector('button');
var showSubmitButton = false;
var droppedFiles;

if (!showSubmitButton) submit.style.display = 'none';

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
  form.addEventListener(event, function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

['dragover', 'dragenter'].forEach(function(event) {
  form.addEventListener(event, function(e) {
    form.classList.add('is-dragover');
  });
});

['dragend', 'dragleave', 'drop'].forEach(function(event) {
  form.addEventListener(event, function(e) {
    form.classList.remove('is-dragover');
  });
});

// Handle dropped files
form.addEventListener('drop', function(e) {
  droppedFiles = e.dataTransfer.files;
  submit.classList.add('active');
  if (!showSubmitButton) {
    handleFiles(droppedFiles);
  }
});

// Handle input-files
var input = form.querySelector('input');
input.addEventListener('change', function(e) {
  droppedFiles = this.files;
  submit.classList.add('active');
  if (!showSubmitButton) {
    handleFiles(droppedFiles);
  }
}, false);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (droppedFiles == undefined) return;
  handleFiles(droppedFiles);
});

form.style.cursor = 'pointer';
form.addEventListener('click', function(e) {
  form.querySelector('#file').click();
});


function handleFiles(files) {
  if (files.length < 1) {
    throw new Error("No files: Expected one file.");
  }
  var file = files[0];
  if (file.type !== "application/x-chrome-extension") {
    throw new Error("Invalid file: It is not a Chrome extension.");
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    var data = reader.result;
    var buf = new Uint8Array(data);

    // 43 72 32 34 (Cr24)
    if (buf[0] !== 67 || buf[1] !== 114 || buf[2] !== 50 || buf[3] !== 52) {
        throw new Error("Invalid header: Does not start with Cr24.");
    }

    // 02 00 00 00
    if (buf[4] !== 2 || buf[5] !== 0 || buf[6] !== 0 || buf[7] !== 0) {
        throw new Error("Unexpected crx format version number.");
    }

    var publicKeyLength = 0 + buf[8] + (buf[9] << 8) + (buf[10] << 16) + (buf[11] << 24);
    var signatureLength = 0 + buf[12] + (buf[13] << 8) + (buf[14] << 16) + (buf[15] << 24);

    // 16 = Magic number (4), CRX format version (4), lengths (2x4)
    var header = 16;
    var zipStartOffset = header + publicKeyLength + signatureLength;

    var zip = buf.slice(zipStartOffset, buf.length);

    downloadFile(file.name.replace(".crx", ".zip"), [zip]);
  }
  reader.readAsArrayBuffer(file);
}

function downloadFile(filename, data) {
  var a = document.createElement('a');
  a.style = "display: none";
  var blob = new Blob(data, {type: "application/octet-stream"});
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
