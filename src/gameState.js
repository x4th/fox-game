import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  scene: undefined,
  wakeTime: undefined,
  sleepTime: undefined,
  hungryTime: undefined,
  dieTime: undefined,
  poopTime: undefined,
  tick() {
    this.clock++;
    console.log("clock", this.clock, this);
    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    else if (this.clock === this.timeToStartCelebrating)
      this.startCelebrating();
    else if (this.clock === this.timeToEndCelebrating) this.endCelebrating();
    else if (this.clock === this.poopTime) this.poop();
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 2;
    modFox("egg");
    modScene("day");
    writeModal();
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = undefined;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  clearTimes() {
    this.wakeTime = undefined;
    this.sleepTime = undefined;
    this.hungryTime = undefined;
    this.dieTime = undefined;
    this.poopTime = undefined;
    this.timeToStartCelebrating = undefined;
    this.timeToEndCelebrating = undefined;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = undefined;
    modFox("hungry");
  },
  die() {
    this.current = "DEAD";
    modScene("dead");
    modFox("dead");
    this.clearTimes();
    writeModal("The fox died :( <br /> Press the middle button to restart.");
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToStartCelebrating = undefined;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.timeToEndCelebrating = undefined;
    this.current = "IDLING";
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modFox("rain");
      } else {
        modFox("idling");
      }
    }
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      // do nothing
      return;
    }

    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  cleanUpPoop() {
    if (this.current !== "POOPING") return;
    this.dieTime = undefined;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  feed() {
    if (this.current !== "HUNGRY") return;
    this.current = "FEEDING";
    this.dieTime = undefined;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = undefined;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
