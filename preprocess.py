import librosa
import soundfile as sf
import ffmpeg
import subprocess
import cv2
import os

# read the given video file and extract the audio and frames from it


def extract_audio(video_file, audio_file):
    command = "ffmpeg -i " + video_file + \
        " -ab 160k -ac 2 -vn " + audio_file
    subprocess.call(command, shell=True)


def extract_frames(video_file, frames_dir):
    command = "ffmpeg -i " + video_file + " -vf fps=8 " + frames_dir + "/%06d.jpg"

    # ffmpeg -i $j -q:v 1 -qmin 1 -qmax 1 -vf "fps=8" data/frames/$INSTR/$CODE/%06d.jpg
    # ffmpeg -i file.mpg -r 1/1 $filename%03d.jpg

    subprocess.call(command, shell=True)


# downsample the audio to 11025Hz
def downsample_audio(audio_file, downsampled_audio_file, sr=11025):
    y, sr = librosa.load(audio_file, sr=sr)
    sf.write(downsampled_audio_file, y, sr)


# downsample the frames to 224x224
def downsample_frames(frames_dir, downsampled_frames_dir):
    for filename in os.listdir(frames_dir):
        image = cv2.imread(os.path.join(frames_dir, filename))
        image = cv2.resize(image, (224, 224))
        cv2.imwrite(os.path.join(downsampled_frames_dir, filename), image)


def downsampleAudioAndVideo(videopath, output_path):

    # extract the audio and frames from the video
    wav_file_path = output_path + '/wav'
    frames_file_path = output_path + '/frames/original'
    extract_audio(videopath, wav_file_path + '/' + 'original.wav')
    extract_frames(videopath, frames_file_path)

    # write the original audio and frames to a video file
    command = "ffmpeg -framerate 8 -i " + frames_file_path + "/%06d.jpg -i " + wav_file_path + \
        "/original.wav -c:v libx264 -c:a aac -strict experimental -b:a 98k -pix_fmt yuv420p " + \
        output_path + "/original.mp4"
    subprocess.call(command, shell=True)

    # downsample the audio and frames
    downsample_audio(wav_file_path + '/' + 'original.wav',
                     wav_file_path + '/' + 'downsampled.wav')
    downsample_frames(frames_file_path, output_path + '/frames/downsampled')

    # write the downsampled audio and frames to a video file
    downsample_audio_path = wav_file_path + '/' + 'downsampled.wav'
    downsample_frames_path = output_path + '/frames/downsampled'

    command = "ffmpeg -framerate 8 -i " + downsample_frames_path + "/%06d.jpg -i " + downsample_audio_path + \
        " -c:v libx264 -c:a aac -strict experimental -b:a 98k -pix_fmt yuv420p " + \
        output_path + "/downsampled.mp4"
    subprocess.call(command, shell=True)


video_id = '001851'
path = f'../../data/FAIR-Play/data/videos/{video_id}.mp4'
final_path = f'./files/{video_id}'

if not os.path.exists(final_path):
    os.makedirs(final_path)
    os.makedirs(final_path + '/wav')
    os.makedirs(final_path + '/frames')
    os.makedirs(final_path + '/frames/original')
    os.makedirs(final_path + '/frames/downsampled')

# downsampleAudioAndVideo(path, final_path)


def generateFakeWaveFile(wave_file_path):
    y, sr = librosa.load(f'{wave_file_path}/downsampled.wav', sr=11025)
    for i in range(0, 14):
        for j in range(0, 14):
            output_path = f'{wave_file_path}/{i}_{j}.wav'
            sf.write(output_path, y, sr)


generateFakeWaveFile(f'static/files/{video_id}/wav')
