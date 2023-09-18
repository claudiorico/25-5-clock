class Stopwatch {
  #elapsedTimeInSeconds = 1500;
  #intervalId = null;
  breakLength = 5;
  sessionLength = 25;
  sessionStoped = true;

  start(callback = () => {}) {
    if (this.sessionStoped) {
      this.#intervalId = setInterval(() => {
        this.#elapsedTimeInSeconds--;
        this.sessionStoped = false;
        callback();
      }, 1000);
    } else {
      this.sessionStoped = true;
      this.stop(callback);
    }
  }

  stop(callback = () => {}) {
    clearInterval(this.#intervalId);
    callback();
  }

  restart(callback = () => {}) {
    this.#elapsedTimeInSeconds = 1500;
    this.breakLength = 5;
    this.sessionLength = 25;
    callback();
  }

  get elapsedTime() {
    return Stopwatch.formatTime(this.#elapsedTimeInSeconds);
  }

  get sessionLength() {
    return this.sessionLength;
  }

  incrementBreak() {
    if (this.breakLength < 60) {
      this.breakLength++;
    }
  }

  decrementBreak() {
    if (this.breakLength > 1) {
      this.breakLength--;
    }
  }

  incrementSession(callback = () => {}) {
    if (this.sessionLength < 60) {
      this.sessionLength++;
    }
    if (this.sessionStoped) {
      this.#elapsedTimeInSeconds = 60 * this.sessionLength;
    }
    callback();
  }

  decrementSession(callback = () => {}) {
    if (this.sessionLength > 1) {
      this.sessionLength--;
    }
    if (this.sessionStoped) {
      this.#elapsedTimeInSeconds = 60 * this.sessionLength;
    }
    callback();
  }

  static formatTime(timeInSeconds) {
    const minutes =
      timeInSeconds === 3600 ? 60 : Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds - minutes * 60;

    return `${Stopwatch.zeroPadding(minutes)}:${Stopwatch.zeroPadding(
      seconds
    )}`;
  }

  static zeroPadding(originalNumber, desiredAmountDigits = 2) {
    let stringNumber = String(originalNumber);
    const zeroesRequired = desiredAmountDigits - stringNumber.length;

    if (zeroesRequired <= 0) {
      return stringNumber;
    }

    for (let counter = 0; counter < zeroesRequired; counter++) {
      stringNumber = `0${stringNumber}`;
    }

    return stringNumber;
  }
}

const startBtn = document.getElementById("start_stop");
// const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const stopwatchDisplay = document.getElementById("time-left");
const sessionDe = document.getElementById("session-decrement");
const sessionLength = document.getElementById("session-length");
const sessionIn = document.getElementById("session-increment");

function updateDisplay() {
  stopwatchDisplay.innerText = sw1.elapsedTime;
  sessionLength.innerText = sw1.sessionLength;
}

const sw1 = new Stopwatch();

startBtn.addEventListener("click", () => {
  sw1.start(updateDisplay);
});
// stopBtn.addEventListener("click", () => {
//   sw1.stop(updateDisplay);
// });
resetBtn.addEventListener("click", () => {
  sw1.restart(updateDisplay);
});

sessionDe.addEventListener("click", () => {
  sw1.decrementSession(updateDisplay);
});

sessionIn.addEventListener("click", () => {
  sw1.incrementSession(updateDisplay);
});
