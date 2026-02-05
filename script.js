// 音乐播放列表 - 在这里添加您的音乐文件
// 注意：音乐文件需要放在music文件夹中
// 临时使用在线图片
const playlist = [
    {
        title: "Counting Stars",
        artist: "OneRepublic",
        src: "music/song1.mp3",
        cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "Dream It Possible",
        artist: "Delacey",
        src: "music/song2.mp3",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "春节序曲",
        artist: "中国广播民族乐团",
        src: "music/song3.mp3",
        cover: "https://img95.699pic.com/photo/50107/5435.jpg_wh860.jpg"
    }
];
// DOM元素
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const albumCover = document.getElementById('albumCover');
const playlistEl = document.getElementById('playlist');

// 播放器状态
let currentSongIndex = 0;
let isPlaying = false;

// 初始化播放列表
function initializePlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-music"></i>
            <span>${song.title} - ${song.artist}</span>
        `;
        li.addEventListener('click', () => loadSong(index));
        playlistEl.appendChild(li);
    });
}

// 加载歌曲
function loadSong(index) {
    currentSongIndex = index;
    const song = playlist[index];
    
    audioPlayer.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumCover.src = song.cover;
    
    // 更新播放列表高亮
    const playlistItems = playlistEl.querySelectorAll('li');
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 如果播放器正在播放，继续播放新歌曲
    if (isPlaying) {
        audioPlayer.play();
    }
}

// 播放/暂停
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    audioPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add('playing');
}

function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove('playing');
}

// 上一首
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// 下一首
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// 更新进度条
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.value = progressPercent;
        
        // 更新时间显示
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

// 设置进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

// 设置音量
function setVolume() {
    audioPlayer.volume = this.value / 100;
}

// 歌曲结束时自动播放下一首
function songEnded() {
    nextSong();
}

// 事件监听
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', songEnded);
progress.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);

// 初始化
initializePlaylist();
loadSong(0);

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            prevSong();
            break;
        case 'ArrowRight':
            nextSong();
            break;
    }
});
