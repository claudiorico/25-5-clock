class Stopwatch {
  #elapsedTimeInSeconds = 1500;
  #intervalId = null;
  breakLength = 5;
  sessionLength = 25;
  sessionStoped = true;
  breakActive = false;
  lastMinute = false;
  beepActive = false;

  start(callback = () => {}) {
    if (this.sessionStoped) {
      this.#intervalId = setInterval(() => {
        this.#elapsedTimeInSeconds--;
        if (this.#elapsedTimeInSeconds === 0) {
          if (!this.breakActive) {
            this.#elapsedTimeInSeconds = this.breakLength * 60;
            this.breakActive = true;
          } else {
            this.#elapsedTimeInSeconds = this.sessionLength * 60;
            this.breakActive = false;
          }
          this.beepActive = true;
        }

        if (this.#elapsedTimeInSeconds <= 60) {
          this.lastMinute = true;
        } else {
          this.lastMinute = false;
        }

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

  get breakLength() {
    return this.breakLength;
  }

  get breakActive() {
    return this.breakActive;
  }

  get lastMinute() {
    return this.lastMinute;
  }

  get beepActive() {
    return this.beepActive;
  }

  set beepActive(newValue) {
    this.beepActive = newValue;
  }

  incrementBreak(callback = () => {}) {
    if (this.breakLength < 60) {
      this.breakLength++;
    }
    callback();
  }

  decrementBreak(callback = () => {}) {
    if (this.breakLength > 1) {
      this.breakLength--;
    }
    callback();
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
const resetBtn = document.getElementById("reset");
const stopwatchDisplay = document.getElementById("time-left");
const sessionDe = document.getElementById("session-decrement");
const sessionLength = document.getElementById("session-length");
const sessionIn = document.getElementById("session-increment");
const breakDe = document.getElementById("break-decrement");
const breakLength = document.getElementById("break-length");
const breakIn = document.getElementById("break-increment");
const timerLabel = document.getElementById("timer-label");
const displayContainer =
  document.getElementsByClassName("display-container")[0];
const audio = document.getElementById("beep");

function updateDisplay() {
  stopwatchDisplay.innerText = sw1.elapsedTime;
  sessionLength.innerText = sw1.sessionLength;
  breakLength.innerText = sw1.breakLength;
  timerLabel.innerText = sw1.breakActive ? "Break" : "Session";

  if (sw1.lastMinute) {
    displayContainer.classList.add("red");
  } else {
    displayContainer.classList.remove("red");
  }

  if (sw1.beepActive) {
    audio.play();
    sw1.beepActive = false;
  }
}

const sw1 = new Stopwatch();

startBtn.addEventListener("click", () => {
  sw1.start(updateDisplay);
});

resetBtn.addEventListener("click", () => {
  let audio = document.getElementById("beep");
  audio.pause();
  audio.currentTime = 0;
  sw1.restart(updateDisplay);
});

sessionDe.addEventListener("click", () => {
  sw1.decrementSession(updateDisplay);
});

sessionIn.addEventListener("click", () => {
  sw1.incrementSession(updateDisplay);
});

breakDe.addEventListener("click", () => {
  sw1.decrementBreak(updateDisplay);
});

breakIn.addEventListener("click", () => {
  sw1.incrementBreak(updateDisplay);
});
