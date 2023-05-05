import os
import subprocess
import ffmpeg


# convert wav codec from pcm_s64le to pcm_f16le
def convert_wav_codec(wav_file, converted_wav_file):
    commnand = "ffmpeg -i " + wav_file + " -c:a pcm_s16le " + converted_wav_file
    subprocess.call(commnand, shell=True)


path = './static/files/mono2binaural/wav'
for filename in os.listdir(path):
    if filename.endswith(".wav"):
        convert_wav_codec(os.path.join(path, filename),
                          os.path.join(path, f'{filename.split(".")[0]}_converted.wav'))
        continue
    else:
        continue
