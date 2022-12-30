const useTTS = () => ({ say })

const say = (phrase: string) => {
  if (speechSynthesis.speaking) speechSynthesis.cancel()
  speechSynthesis.speak(new SpeechSynthesisUtterance(phrase));
}

export default useTTS;