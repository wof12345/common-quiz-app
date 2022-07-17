let giveID = function () {
  let seed = new Date();
  currentSeed = seed.getTime();
};

function animateCommon(params, style) {
  params.forEach((elm, ind) => {
    elm.style = style[ind];
  });
}

function generateFloatingWindow(message, position) {
  floatingMessage.textContent = message;

  // console.log(pageVariable.floatingWindow);

  animateCommon(
    [floatingWindow],
    [`opacity:1; top:${position[0]};right:${position[1]}; pointer-events: all`]
  );

  setTimeout(() => {
    animateCommon(
      [floatingWindow],
      [`opacity:0; top:${position[0]};right:${position[1]};`]
    );
  }, 1000);
}

function getQuiz(seed) {
  let data = Object.keys(availableQuizzesData);
  data.forEach((key, ind) => {
    if (availableQuizzesData[key][1] === seed) {
      lastQuizInd = availableQuizzesData[key][0];
    }
  });
}

function addeventlistenerTextArea(elm) {
  elm.setAttribute("style", "overflow-y:hidden;");
  elm.addEventListener("input", OnInput, false);

  function OnInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
}

function populateAvailQuizz() {
  let quizzes = "";
  console.log(availableQuizzesData);

  let data = Object.keys(availableQuizzesData);
  data.forEach((key) => {
    quizzes += quizComp(
      availableQuizzesData[key][1],
      availableQuizzesData[key][3]
    );
  });
  availableQuizzes.innerHTML = quizzes;
}

function generateUserQuiz(currentQuiz, color, check) {
  let target = quizContainer;
  target.innerHTML = "";
  latestCorrect = [];
  let backupColor = color;
  let backupCheck = check;

  let userHtml = "";
  let data = Object.keys(currentQuiz);

  data.forEach((items, ind) => {
    let mainItem = currentQuiz[items][1];
    let quizBlockUserG = "";

    extraData[0].value = timeLimit = currentQuiz[items][3];
    extraData[1].value = currentTitle = currentQuiz[items][4];
    extraData[2].value = currentAuthor = currentQuiz[items][5];

    quizBlockUserG += quizBlockUser(ind, currentQuiz[items][0]);
    latestCorrect.push(currentQuiz[items][2]);

    for (let i = 0; i < mainItem.length; i++) {
      // console.log(color, currentQuiz[items][2], i, currentQuiz[items][2] === i);

      if (color && currentQuiz[items][2] === i) {
        // console.log(color, i, currentQuiz[items][2]);
        color = "checked";
      } else {
        color = backupColor;
      }

      console.log(check, i, lastSelections[ind]);

      if (check && i === lastSelections[ind] && lastSelections) {
        console.log(color, ind, currentQuiz[items][2]);
        check = "checked";
      } else {
        check = backupCheck;
      }

      quizBlockUserG += quizProps.mcquserside(
        i,
        items,
        mainItem[i],
        `choice${ind}`,
        color,
        check
      );

      // console.log(quizBlockUserG);
    }
    quizBlockUserG += "</div>";
    quizBlockUserG += "</div> <!--end-->";
    userHtml += quizBlockUserG;
  });

  // console.log(userHtml);

  target.innerHTML = userHtml;
}

function getCheckedValue(elm) {
  for (let it = 0; it < elm.length; it++) {
    if (elm[it].checked) return [elm[it].value, it];
  }
}

function addMCQ() {
  commonQueryCode(quizBlock);
}

let quizBlock = function (id) {
  return `<div class="user_choice mcq" id="${id}"  style="opacity:0;padding: 0; transition:.5s;">
        <div class="choice_sel"><p>${
          id + 1
        }.</p><textarea rows="1"  class="ques" type="text" name="question"  id="${id}" placeholder="Question"></textarea></div>
        <div class="choice_cont">
        <div class="choice_sel"><input class="choice" type="radio" name="choice${id}" value="1"><textarea rows="1"  class="choices" type="text" placeholder="choice1" ></textarea></div>
        <div class="choice_sel"><input class="choice" type="radio" name="choice${id}" value="2"><textarea rows="1"  class="choices" type="text" placeholder="choice2" ></textarea></div>
        </div>
        <button class="add_mcq" style="margin:6px;padding:3px">add choice</button> 
        <button class="delete_mcq" style="margin:6px;padding:3px">delete choice</button> 
        </div>
        <!--split-->`;
};

let quizBlockUser = function (id, question) {
  return `<div class="user_choice mcq ${id}" style="opacity:1;padding: 0; transition:.5s;">
    <div class="choice_sel"><p>${
      id + 1
    }.</p><p class="ques">${question}</p></div>
    <div class="choice_cont">
    `;
};

let quizComp = function (seed, title) {
  return `<div class="av_q" data-seed="${seed}">Quiz-${title}</div>`;
};

let quizProps = {
  buttonAdd: "",
  mcq: function (choiceNo, name) {
    return `<div class="choice_sel"><input class="choice" type="radio" name="${name}" value="${choiceNo}"><textarea rows="1"  class="choices" type="text" placeholder="choice${choiceNo}" ></textarea></div>`;
  },
  mcquserside: function (choiceNo, it, answer, name, color, check) {
    return `<div class="choice_sel  ${color}"><input ${check} class="choice" type="radio" name="${name}" id="${
      choiceNo + "" + it
    }"  value="${answer}"><p class="choices">${answer}</p></div>`;
  },
};

function getAndCheckData() {
  let data = getQuizData(quizPage.querySelectorAll(".mcq"));
  // console.log(data);
  lastSelections = data;

  if (data && data !== "msg") {
    checkAndViewResult(data);
  } else {
  }

  quizContainer.style = "pointer-events:none;";
}

function commonQueryCode(premade) {
  let target = quizContainer;
  let lastChild = target.lastElementChild;
  // console.log(lastChild);

  let lastChoice = lastChild?.getAttribute("id");

  if (!lastChoice) {
    lastChoice = 0;
  } else {
    lastChoice++;
  }

  target.insertAdjacentHTML("beforeend", premade(lastChoice));
  let mcqDiv = target.lastElementChild;
  setTimeout(() => {
    mcqDiv.style = "";
  }, 300);
}

function initiateEventHandler(elm) {
  let prevSib = elm.previousElementSibling;
  let lastChild = prevSib.lastElementChild;
  let lastChoice = lastChild.firstChild.getAttribute("value");
  let currentName = lastChild.firstChild.getAttribute("name");

  +lastChoice++;
  prevSib.insertAdjacentHTML(
    "beforeend",
    quizProps.mcq(lastChoice, currentName)
  );
}

function checkAndViewResult(data) {
  let correct = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === latestCorrect[i]) {
      correct++;
    }
  }

  userResultPage.style = "top:0;";
  userResultPage.querySelector(".title").textContent =
    "Quiz no : " + currentSeed;
  userResultPage.querySelector(
    ".defined_msg"
  ).textContent = `You have gotten ${correct} correct out of ${data.length}`;
}

document.addEventListener("click", (e) => {
  let target = e.target;
  let targetClass = target.className;

  if (!targetClass.includes("added")) {
    target.classList.add("added");

    if (targetClass.includes("choices")) {
      addeventlistenerTextArea(target);
    }

    if (targetClass.includes("ques")) {
      addeventlistenerTextArea(target);
    }
  }

  if (targetClass.includes("add_mcq")) {
    initiateEventHandler(target);
  }

  if (targetClass.includes("delete_mcq")) {
    let choiceToRemove =
      target.previousElementSibling.previousElementSibling.lastElementChild;
    if (choiceToRemove.firstElementChild.value <= 2) {
    } else
      target.previousElementSibling.previousElementSibling.lastElementChild.remove();
  }
});

add.addEventListener("click", () => {
  addMCQ();
});

delet.addEventListener("click", function (e) {
  let lastQueryToRemove = quizContainer.lastElementChild;
  if (lastQueryToRemove) lastQueryToRemove.remove();
});

done.addEventListener("click", () => {
  if (!userPage) {
    let flag = getQuizData(quizPage.querySelectorAll(".mcq"));
    if (flag === true) {
      localStorage.setItem("quizData", JSON.stringify(availableQuizzesData));
      populateAvailQuizz();
      quizPage.style.display = "";
    } else if (flag === "msg") {
      generateFloatingWindow("Cancelled!", ["20%", "0px"]);
      quizPage.style.display = currentSeed = "";
    }
  } else {
    endSequence();
  }
});

back.addEventListener("click", () => {
  generateUserQuiz(lastQuizInd);
  endSequence();
});

show.addEventListener("click", () => {
  generateUserQuiz(lastQuizInd, "y", "y");
});
