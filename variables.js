let start = document.querySelector(`.start`);
let startUser = document.querySelector(`.start_user`);
let make = document.querySelector(`.make`);

let quizId = document.querySelector(`h2`);
let add = document.querySelector(`.add`);
let delet = document.querySelector(`.delete`);
let done = document.querySelector(`.done`);
let show = document.querySelector(`.show`);
let back = document.querySelector(`.back`);
let floatingWindow = document.querySelector(`.floating_message`);
let floatingMessage = document.querySelector(`.floating_message-message`);
let userPage = false;

let latestCorrect = [];
let lastSelections = [];

let availableQuizzes = document.querySelector(`.available_quizzes`);

let innerContainer = document.querySelectorAll(".inner_container");

let quizCollection = {};

let availableQuizzesData = {};

let quizzes = 0;

let lastQuizInd = 0;

let quizPage = document.querySelector(`.make_give_quiz`);
let quizContainer = document.querySelector(`.quiz_container`);
let userResultPage = document.querySelector(`.userResultPage`);

let currentSeed = "";

let extraData = document.querySelectorAll(`.util`);
let timeLimit = 0;
let currentAuthor;
let currentTitle;

let interval = [];

var worker = new Worker("./timer-worker.js");
var workerTimer = {
  id: 0,
  callbacks: {},
  setInterval: function (cb, interval, context) {
    this.id++;
    var id = this.id;
    this.callbacks[id] = { fn: cb, context: context };
    worker.postMessage({
      command: "interval:start",
      interval: interval,
      id: id,
    });
    return id;
  },
  onMessage: function (e) {
    switch (e.data.message) {
      case "interval:tick":
        var callback = this.callbacks[e.data.id];
        if (callback && callback.fn) callback.fn.apply(callback.context);
        break;
      case "interval:cleared":
        delete this.callbacks[e.data.id];
        break;
    }
  },
  clearInterval: function (id) {
    worker.postMessage({ command: "interval:clear", id: id });
  },
};
worker.onmessage = workerTimer.onMessage.bind(workerTimer);
