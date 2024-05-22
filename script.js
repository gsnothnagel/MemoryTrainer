$("#colorPicker").spectrum({
    color: 'rgb(128, 128, 128)',
    showButtons: false,
    flat: true,
    move: function (color) {
        colors[colorIndex] = color.toRgbString();
        drawCanvas();
    }
});

document.getElementById('generateButton').addEventListener('click', () => {
    generateImage();
});

function generateImage() {
    numPixels = parseInt(document.getElementById('pixelInput').value, 10);

    fetch(`/random-image?size=${numPixels}`)
        .then(response => response.blob())
        .then(blob => {
            const img = document.getElementById('randomImage');
            img.src = URL.createObjectURL(blob);
            img.style.display = 'block';

            colors = Array(numPixels * numPixels).fill('rgb(128, 128, 128)');
            canvas.style.display = 'none';
            document.getElementById('checkButton').style.visibility = 'hidden';
            resize();
        })
}

document.getElementById('toggleButton').addEventListener('click', () => {

    const img = document.getElementById('randomImage');

    if (canvas.style.display == 'block') {
        canvas.style.display = 'none';
    } else {
        canvas.style.display = 'block';
    }

    if (img.style.display == 'block') {
        img.style.display = 'none';
    } else {
        img.style.display = 'block';
    }

    if (document.getElementById('checkButton').style.visibility == 'visible') {
        document.getElementById('checkButton').style.visibility = 'hidden';
    } else {
        document.getElementById('checkButton').style.visibility = 'visible';
    }

});

function stdDev(arr) {
    let mean = 0;
    for (let i = 0; i < arr.length; i++) {
        mean += arr[i];
    }
    mean /= arr.length;

    let SD = 0;
    for (let i = 0; i < arr.length; i++) {
        SD += (arr[i] - mean) ** 2;
    }
    SD /= arr.length;
    SD = Math.sqrt(SD);

    return SD;
}

document.getElementById('checkButton').addEventListener('click', () => {

    var canvas2 = document.createElement('canvas');
    canvas2.width = numPixels;
    canvas2.height = numPixels;
    canvas2.style.display = 'none';

    const ctx = canvas2.getContext("2d");
    ctx.drawImage(document.getElementById('randomImage'), 0, 0);
    const imageData = ctx.getImageData(0, 0, numPixels, numPixels);

    let errors = [];
    for (let i = 0; i < colors.length; i++) {
        let matches = colors[i].match(/(\d[\d\.]*)/g);
        for (let j = 0; j < 3; j++) {
            errors.push((parseInt(matches[j], 10) - imageData.data[i * 4 + j]) / 256);
        }
    }

    window.alert(stdDev(errors));

    canvas2.remove();

});

let canvas = document.getElementById('memoryCanvas');
canvas.style.cursor = 'auto';
canvas.style.display = 'none';
generateImage();
document.getElementById('checkButton').style.visibility = 'hidden';
var colors;
var numPixels;
var pixelSize;
var colorIndex;

canvas.addEventListener('mousedown', (event) => {

    const rect = canvas.getBoundingClientRect();
    const mouseX = Math.floor((event.clientX - rect.left) / pixelSize);
    const mouseY = Math.floor((event.clientY - rect.top) / pixelSize);

    colorIndex = mouseY * numPixels + mouseX;
    $("#colorPicker").spectrum("set", colors[colorIndex]);
    
});

function drawCanvas() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < numPixels; y++) {
        for (let x = 0; x < numPixels; x++) {
            const color = colors[y * numPixels + x] || 'rgb(0, 0, 0)';
            ctx.fillStyle = color;
            const xPos = Math.ceil(x * pixelSize);
            const yPos = Math.ceil(y * pixelSize);
            const rectWidth = Math.ceil(pixelSize);
            const rectHeight = Math.ceil(pixelSize);
            ctx.fillRect(xPos, yPos, rectWidth, rectHeight);
        }
    }
}

window.addEventListener('resize', () => {
    resize();
});


function resize() {
    const imageSize = Math.min(window.innerWidth / 2, window.innerHeight) * 0.8;
    const img = document.getElementById('randomImage');
    img.style.width = `${imageSize}px`;
    img.style.height = `${imageSize}px`;

    //set picker-container width
    var pickerContainer = document.querySelector('.sp-picker-container');
    if (pickerContainer) {
        pickerContainer.style.width = imageSize + "px";
        $("#colorPicker").spectrum("reflow");
    } else {
        console.error('.sp-picker-container element not found.');
    }

    canvas.width = imageSize;
    canvas.height = imageSize;
    pixelSize = canvas.width / numPixels;

    drawCanvas();
}
