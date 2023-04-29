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
    waveColor: "#5FDDC8",
    progressColor: "#178A77",
    barWidth: 2,
    height: 100,
    // backend: "MediaElement",
  });
  wavesurfer.load(fileUrl);

  const videoPlayer = document.querySelector(`#video-player-${playerId}`);
  videoPlayer.addEventListener("play", () => {
    wavesurfer.play();
  });
  videoPlayer.addEventListener("pause", () => {
    wavesurfer.pause();
  });

  let isWaveformClicked = false;
  videoPlayer.addEventListener("timeupdate", () => {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    const progressPercentage = currentTime / duration;
    if (!isWaveformClicked) {
      wavesurfer.seekTo(progressPercentage);
    }
  });

  wavesurfer.on("seek", (position) => {
    if (isWaveformClicked) {
      videoPlayer.currentTime = position * videoPlayer.duration;
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
