
import { Howl } from "howler";
import { clamp } from "@/util";
import { ref, watch } from "vue";

const useSound = () => ({ play });

const play = (path: string, volume = .5) => {
  let sound = new Howl({ src: path, volume: clamp(_globalVolume.value * volume) })
  sound.play();
}

const _globalVolume = ref(.5);
watch(_globalVolume, n => _globalVolume.value = clamp(n));

export default useSound;