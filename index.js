function resetQuizPage() {
  quizContainer.innerHTML = "";
  quizId.textContent = `Quiz ID : ${currentSeed}`;
  quizPage.style.display = "flex";
  extraData[0].value = "";
  extraData[1].value = "";
  extraData[2].value = "";
}

function userPageInit(flg) {
  if (flg) {
    add.style.display = "none";
    delet.style.display = "none";
    startUser.style.display = "";
    show.style.display = "";
    for (let i = 0; i < extraData.length; i++) {
      extraData[i].style = "pointer-events:none;";
    }
    quizContainer.style = "pointer-events:none;";
  } else {
    startUser.style.display = "none";
    show.style.display = "none";
    add.style.display = "";
    delet.style.display = "";
    for (let i = 0; i < extraData.length; i++) {
      extraData[i].style = "pointer-events:all;";
    }
    quizContainer.style = "pointer-events:all;";
  }
}

function invokeQuizPage() {
  if (currentSeed === "") {
    userPageInit(false);
    giveID();
    resetQuizPage();
    userPage = false;
  } else {
    userPageInit(true);
    userPage = true;
    getQuiz(currentSeed);
    let currentQuiz = lastQuizInd;
    // console.log(currentQuiz);

    if (currentQuiz) {
      resetQuizPage();
      generateUserQuiz(currentQuiz);
    } else {
      currentSeed = "";
      generateFloatingWindow("Quiz doesen't exist.", ["250px", "330px"]);
    }
  }
}

function endSequence() {
  if (interval[0]) {
  clearInterval(interval[0]);
    interval = [];
    getAndCheckData();
  } else {
    userResultPage.style = currentSeed = quizContainer.innerHTML = "";
    quizPage.style.display = "";
  }
  show.style = "pointer-events:all;";
}

function allowUser() {
  quizContainer.style = "pointer-events:all;";
  show.style = "pointer-events:none;";
  let time = timeLimit * 1000;

  interval.push(
    setInterval(() => {
      extraData[0].value = time / 1000;
      console.log(time);

      time -= 100;
      if (time <= 0) {
        endSequence();
      }
    }, 100)
  );
}

function populateAvailQuizzData() {
  let temp = JSON.parse(localStorage.getItem("quizData"));
  if (temp) {
    let data = Object.keys(temp);

    // console.log(temp);

    data.forEach((key) => {
      quizzes++;
      availableQuizzesData[`${quizzes}`] = temp[key];
    });
    populateAvailQuizz();
  }
}
populateAvailQuizzData();

start.addEventListener("click", () => {
  innerContainer[1].style = "opacity:1;pointer-events:all;";
});

make.addEventListener("click", () => {
  invokeQuizPage();
});

startUser.addEventListener("click", () => {
  if (!interval[0]) allowUser();
  generateUserQuiz(lastQuizInd);
});

innerContainer[1].addEventListener("click", (e) => {
  let target = e.target;
  let targetClass = target.className;

  // console.log(target, targetClass);

  if (targetClass.includes("av_q")) {
    let seed = target.dataset["seed"];
    // console.log(seed);

    // console.log(availableQuizzesData);

    currentSeed = seed;
    invokeQuizPage();
  }
});
