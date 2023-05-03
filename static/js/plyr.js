// import Plyr from "plyr";
// const player = new Plyr("#player");
// // const player = new Plyr(".js-player");

function createWaveformAndSpectrogram(
  playerId,
  fileUrl,
  showSpectrogram = true
) {
  const wavesurfer = WaveSurfer.create({
    container: `#waveform-${playerId}`,
    waveColor: "#5FDDC8",
    progressColor: "#178A77",
    barWidth: 2,
    height: 100,
    plugins: showSpectrogram
      ? [
          WaveSurfer.spectrogram.create({
            container: `#spectrogram-${playerId}`,
            labels: true,
            height: 256,
          }),
        ]
      : [],
  });
  wavesurfer.load(fileUrl);

  const audioPlayer = document.querySelector(`#audio-player-${playerId}`);
  audioPlayer.addEventListener("play", () => {
    wavesurfer.setMute(true);
    wavesurfer.play();
  });
  audioPlayer.addEventListener("pause", () => {
    wavesurfer.pause();
  });

  let isWaveformClicked = false;
  audioPlayer.addEventListener("timeupdate", () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercentage = currentTime / duration;
    if (!isWaveformClicked) {
      wavesurfer.seekTo(progressPercentage);
    }
  });

  wavesurfer.on("seek", (position) => {
    if (isWaveformClicked) {
      audioPlayer.currentTime = position * audioPlayer.duration;
    }
    isWaveformClicked = false;
  });

  wavesurfer.on("ready", () => {
    const waveform = wavesurfer.drawer.container;

    waveform.addEventListener("mousedown", () => {
      isWaveformClicked = true;
    });
  });
}

function createWaveformForVideo(playerId, fileUrl) {
  const wavesurfer = WaveSurfer.create({
    container: `#waveform-original-${playerId}`,
    waveColor: "blue",
    progressColor: "green",
    barWidth: 2,
    height: 200,
    backend: "WebAudio",
  });

  let isWaveformClicked = false;

  wavesurfer.on("ready", function () {
    const videoPlayer = document.querySelector(`#video-player-${playerId}`);
    videoPlayer.addEventListener("play", () => {
      wavesurfer.play();
    });
    videoPlayer.addEventListener("pause", () => {
      wavesurfer.pause();
    });

    wavesurfer.on("seek", (position) => {
      if (isWaveformClicked) {
        videoPlayer.currentTime = position * videoPlayer.duration;
      }
      isWaveformClicked = false;
    });

    const waveform = wavesurfer.drawer.container;

    waveform.addEventListener("mousedown", () => {
      isWaveformClicked = true;
    });
  });

  wavesurfer.load(fileUrl);
  // const videoPlayer = document.querySelector(`#video-player-${playerId}`);
  videoPlayer.addEventListener("timeupdate", () => {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    const progressPercentage = currentTime / duration;
    if (!isWaveformClicked) {
      wavesurfer.seekTo(progressPercentage);
    }
  });
}

let wavesurfer = null;
function playDemo(playerId, audio_folder, x, y) {
  if (!wavesurfer) {
    wavesurfer = WaveSurfer.create({
      container: `#waveform-original-${playerId}`,
      waveColor: "blue",
      progressColor: "green",
      barWidth: 2,
      height: 200,
      backend: "WebAudio",
    });
  }

  let isWaveformClicked = false;
  const base_path = "static/files/";
  wave_file = `${base_path}${audio_folder}/wav/${x}_${y}.wav`;

  wavesurfer.empty();
  wavesurfer.load(wave_file);
  wavesurfer.on("ready", function () {
    const videoPlayer = document.querySelector(`#video-player-${playerId}`);
    videoPlayer.currentTime = 0;
    videoPlayer.play();
    wavesurfer.play();
    // videoPlayer.addEventListener("play", () => {
    //   wavesurfer.play();
    // });
    // videoPlayer.addEventListener("pause", () => {
    //   wavesurfer.pause();
    // });

    wavesurfer.on("seek", (position) => {
      if (isWaveformClicked) {
        videoPlayer.currentTime = position * videoPlayer.duration;
      }
      isWaveformClicked = false;
    });

    const waveform = wavesurfer.drawer.container;

    waveform.addEventListener("mousedown", () => {
      isWaveformClicked = true;
    });
  });
}

// function playddddddemo(video_name, video, e) {
//   $(document).ready(function () {
//     var default_h = 384;
//     var default_w = 512;

//     function initWaveSurfer(name, domEl, url) {
//       window[name] = WaveSurfer.create({
//         container: domEl,
//         waveColor: "blue",
//         progressColor: "green",
//       });
//       window[name].load(url);
//     }

//     var sound_srcs = $("*[data-src*=sound-of-pixels]:visible");
//     for (var i = 0, len = sound_srcs.length; i < len; i++) {
//       var e = sound_srcs[i];
//       container_name = "#" + e.getAttribute("id");
//       url = e.getAttribute("data-src");
//       if (container_name.includes("input")) {
//         index = container_name.split("input")[1];
//         wavesurfer_name = "soundtrack" + index;
//       } else {
//         index = container_name.split("demo")[1];
//         wavesurfer_name = "wavesurfer" + index;
//       }
//       initWaveSurfer(wavesurfer_name, container_name, url);
//     }

//     $("video").click(function (e) {
//       var video_name = $(this).attr("class").split(" ")[0];
//       var video = $("video." + video_name)[0];
//       if (video_name.includes("input")) {
//         playOriginal(video_name, video);
//       } else {
//         playDemo(video_name, video, e);
//       }
//     });

//     function playOriginal(video_name, video) {
//       wave_surfer_name = "soundtrack" + video_name.split("Video")[1];
//       wavesurfer = window[wave_surfer_name];
//       video.muted = true;
//       video.currentTime = 0;
//       video.play();
//       wavesurfer.play([0]);
//     }

//     function playDemo(video_name, video, e) {
//       index = video_name.split("Video")[1];
//       wave_surfer_name = "wavesurfer" + index;
//       wavesurfer = window[wave_surfer_name];
//       var scale = 16;
//       var offset = $(video).offset();
//       var xPos = e.pageX - offset.left;
//       var yPos = e.pageY - offset.top;
//       var x = Math.floor(((xPos / video.clientWidth) * default_w) / scale) + 1;
//       var y = Math.floor(((yPos / video.clientHeight) * default_h) / scale) + 1;
//       var x = Math.min(Math.max(x, 1), 32);
//       var y = Math.min(Math.max(y, 1), 24);
//       // console.log(x, y);
//       var sound_src = $(video)[0].src.slice(0, -4) + "/" + x + "_" + y + ".wav";
//       video.muted = true;
//       video.currentTime = 0;

//       // wavesurfer:
//       wavesurfer.empty();
//       wavesurfer.load(sound_src);
//       wavesurfer.on("ready", function () {
//         video.play();
//         wavesurfer.play();
//       });

//       // top is vertical direction, left is horizontal position
//       // offset chosen by inspection
//       var newtop =
//         String((((y - 1) * video.clientHeight) / default_h) * scale + 40) +
//         "px";
//       var newleft =
//         String((((x - 1) * video.clientWidth) / default_w) * scale + 15) + "px";
//       // console.log(newtop, newleft);
//       $(".overlay#dot" + index).css({
//         opacity: "0.5",
//         background: "red",
//         top: newtop,
//         left: newleft,
//       });
//     }
//   });
// }
