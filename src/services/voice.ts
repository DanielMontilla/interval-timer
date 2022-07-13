const speech = window.speechSynthesis;

console.log(speech.getVoices());

const say = (phrase: string, interrupt?: boolean) => {
   let utterThis = new SpeechSynthesisUtterance(phrase);
   if (speech.speaking && interrupt) speech.cancel();
   speech.speak(utterThis);
};

const useVoice = () => ({ say });

export default useVoice;
