
const columsGap=4
const columnCount=512


const volumeSlider = document.querySelector('.slider .level');
const canvas=document.getElementById('player-fireplace')
const ctx=canvas.getContext('2d')
const progressBar = document.getElementById('progress-bar');
const player=document.getElementById('audio-player')
const playButton = document.getElementById('player-btn');
const currentTimeElement = document.getElementById('current-time');
const totalDurationElement = document.getElementById('total-duration');
const fileInput = document.getElementById('musicFileInput');



//ПРЕОБРАЗОВАНИЕ АУДИО В МАССИВ ДЛЯ ОТРИСОВКИ
let audioCtx=new(window.AudioContext || window.webkitAudioContext)()
let sourse=audioCtx.createMediaElementSource(player)
let analyser=audioCtx.createAnalyser()
analyser.fftSize = columnCount;
sourse.connect(analyser)
analyser.connect(audioCtx.destination)
let frequencyData=new Uint8Array(analyser.frequencyBinCount)

document.documentElement.addEventListener("mousedown", function(){
    if(audioCtx.state !== 'running'){
      audioCtx.resume();
    }
 })

//КНОПКА ПАУЗЫ
playButton.onclick=function(){
    if(!this.classList.contains('play-btn-play')){
        player.play()
        this.textContent="Pause"
        this.classList.add('play-btn-play')
    }
    else{
        player.pause()
        this.textContent="Play"
        this.classList.remove('play-btn-play')
        
    }
}


document.addEventListener("DOMContentLoaded", function() {
    
    player.addEventListener('loadedmetadata', function() {
      console.log('sdsd');
      progressBar.max = player.duration;
      totalDurationElement.innerHTML = formatTime(player.duration);
    });
  });

player.addEventListener('timeupdate', function() {
    console.log('asss')

    progressBar.value = player.currentTime;
    currentTimeElement.innerHTML = formatTime(player.currentTime);
});

progressBar.addEventListener('input', function() {
    console.log('ывыв')

    player.currentTime = progressBar.value;
});

function formatTime(seconds) {
    console.log('ывывывыв')

    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - minutes * 60);
    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
}
//ГРОМКОСТЬ
window.onload=function(){
    volumeSlider.oninput = function() {
        player.volume = volumeSlider.value / 100; // value изменяется от 0 до 100, но volume требует значение от 0 до 1
    };
}


//ОТРИСОВКА
window.addEventListener('resize', resizeCanvas, false)


function resizeCanvas(){
  canvas.width=window.innerWidth
  canvas.height=window.innerWidth
}

resizeCanvas()

function drawColumn(x,width,height){
    const gradient=ctx.createLinearGradient(0, canvas.height-height/2,0,canvas.height)
    gradient.addColorStop(1,'rgba(255,255,255,1)')
    gradient.addColorStop(0.9,'rgba(150,0,150,1)')
    gradient.addColorStop(0,'rgba(255,0,255,0)')
    ctx.fillStyle=gradient
    ctx.fillRect(x,canvas.height-height/2,width,height)
}




function render(){

    analyser.getByteFrequencyData(frequencyData)

    frequencyData

    ctx.clearRect(0,0,canvas.width,canvas.height)

    const columnWidth=(canvas.width/frequencyData.length)-columsGap+(columsGap/frequencyData.length)

    const heightScale=canvas.height/100

    let xPos=0

    for(let i=0; i<frequencyData.length; i++){
        let columnHeight=frequencyData[i]*heightScale

        drawColumn(xPos, columnWidth, columnHeight/2)

        xPos+=columnWidth+columsGap
    }
    window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)

