function getQuizData(elm) {
  for (let item in quizCollection) {
    item = [];
  }

  if (elm.length <= 0) {
    return "msg";
  }

  if (!userPage) {
    for (let i = 0; i < elm.length; i++) {
      let queries = elm[i].querySelector(".ques");
      let choices = elm[i].querySelectorAll(".choices");
      let radioBtns = elm[i].querySelectorAll(".choice");

      let choiceTexts = [];
      for (let j = 0; j < choices.length; j++) {
        if (queries.value === "" || choices[j].value === "") {
          generateFloatingWindow("Cannot be empty!", ["20%", "0px"]);
          return false;
        }

        choiceTexts.push(choices[j].value);
      }
      let answer = getCheckedValue(radioBtns);
      // console.log(answer);

      if (answer !== undefined) {
        answer = answer[1];
        quizCollection[`ques${i}`] = [
          queries.value,
          choiceTexts,
          answer,
          extraData[0].value,
          extraData[1].value,
          extraData[2].value,
        ];
      } else {
        generateFloatingWindow("Answer must be specified!", ["20%", "0px"]);
        return false;
      }
    }

    quizzes++;
    availableQuizzesData[`${quizzes}`] = [
      quizCollection,
      currentSeed + "",
      extraData[0].value,
      extraData[1].value,
      extraData[2].value,
    ];

    // console.log(quizCollection);

    return true;
  } else {
    let answers = [];
    for (let i = 0; i < elm.length; i++) {
      let radioBtns = elm[i].querySelectorAll(".choice");
      let answer = getCheckedValue(radioBtns);
      if (answer !== undefined) {
        answer = answer[1];
        answers.push(answer);
      } else {
        generateFloatingWindow("Answer must be Given!", ["20%", "0px"]);
        return false;
      }
    }
    return answers;
  }
}
