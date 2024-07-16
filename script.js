console.log("lets's play with javascript");
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSong() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track) => {
    // let audio = new Audio(track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.src = "images/pause.png"
    document.querySelector(".songInfo").innerHTML = `<img src="images/album.png" alt="">
                <div class="info">
                    <div class="song">${track.replaceAll("%20", " ")}</div>
                    <div class="artist">artist name</div>

                </div>`
    document.querySelector(".songTime").innerHTML = "00:00/00:00"

}

async function main() {

    //get the list of songs
    songs = await getSong()
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // Corrected method name: getElementsByTagName
    for (const song of songs) {
        const decodedSongName = song.replaceAll("%20", " ");
        songUL.innerHTML = songUL.innerHTML +
            `<li>
                <img src="images/musical.png" alt="">
                    <div class="info">
                    <div class="song">${decodedSongName}</div>
                    <div class="artist">Aman Yerwarkar</div>
                    </div>
                    <div class="playNow">
                        <img src="images/playSong.png" alt="">
                    </div></li>`;
        //attach event listener to each song
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    });

    // attach an event listener to play, pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.png"
        } else {
            currentSong.pause()
            play.src = "images/playSong.png"
        }
    })


    // listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".insiderCircle").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add an event listener to seeek bar

    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".insiderCircle").style.width = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add event listener for hamburger
    document.querySelector(".cloz").addEventListener("click", () => {
        document.querySelector(".left").style.left = "100%"
    })

    // add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event listener for previous  and next
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("next")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    // add event for volume control

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("images/mute.png", "images/volume.png")
        } else {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("images/volume.png", "images/mute.png")
        }
    })


    //add event listener for song end
    currentSong.addEventListener("ended", () => {
        console.log("Song ended");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            // If the playlist ends, stop playback or loop to the beginning
            // Here, I'll stop playback when the playlist ends
            currentSong.pause();
            play.src = "images/playSong.png";
            // You might want to handle what to do when the playlist ends
            // Maybe restart from the beginning or show a message
        }
    });


}
main()
