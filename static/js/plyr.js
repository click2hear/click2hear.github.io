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
    waveColor: "#343",
    progressColor: "#333",
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

function createWaveformFromVideo(playerId, fileUrl) {
  var wavesurfer = WaveSurfer.create({
    container: document.querySelector("#video-player-1"),
    waveColor: "#A8DBA8",
    progressColor: "#3B8686",
    backend: "MediaElement",
  });

  // Load audio from existing media element
  //   var mediaElt = document.querySelector("video");

  wavesurfer.load(fileUrl);
}
