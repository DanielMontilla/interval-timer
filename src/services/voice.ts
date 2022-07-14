const speech = window.speechSynthesis;

const say = (phrase: string, interrupt?: boolean) => {
   let utterThis = new SpeechSynthesisUtterance(phrase);
   if (speech.speaking && interrupt) speech.cancel();
   speech.speak(utterThis);
};

const useVoice = () => ({ say });

export default useVoice;
