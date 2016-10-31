myApp.controller('thirdTryController', ['$scope', 'SpellingFactory', function($scope, SpellingFactory){
  console.log('in thirdTryController');
  $scope.placedWord = [];
  $scope.placed = [];

  // pull dataIn from Factory
  var dataIn = SpellingFactory.loadObject();

  $scope.correctWord = dataIn.word.fullWord;
  console.log($scope.correctWord);

  $scope.targetWord = $scope.correctWord;
  $scope.targetArray = $scope.targetWord.split("");
  var targetArray = $scope.targetArray;
  console.log($scope.targetArray);
  $scope.targetGrapheme = dataIn.graphemeToLearn;
  $scope.splitGrapheme = $scope.targetGrapheme.split("");
  var splitGraph = $scope.splitGrapheme;
  console.log($scope.splitGrapheme);
  //
  var Graph = $scope.targetGrapheme;
  console.log(Graph, $scope.correctWord);
  var graphemeIndex = $scope.correctWord.indexOf(Graph);
  console.log(graphemeIndex);

  placeGrapheme();
  //looks for first '_' in playing field and replaces with clicked letter
  $scope.placeLetter = function(letter, index){
    console.log('in placeLetter');
    placedWord = $scope.placedWord.map(function(index){
      return index.letter;
    });
    $scope.placedWord[placedWord.indexOf('_')] = {letter: letter, placedIndex: index};
    $scope.placed[index] = true;
    console.log($scope.placedWord);
  }; // end placeLetter function
  //removes the clicked letter from the playing field
  $scope.removeLetter = function(index, placedIndex){
    $scope.placedWord[index] = {letter: '_', placedIndex: -1};
    $scope.placed[placedIndex] = false;
  };// end removeLetter

  // spellchecking function
  $scope.checkSpelling = function(placedWord){
    placedWord = placedWord.map(function(index){
      return index.letter;
    });
    console.log('in $scope.checkSpelling');
    console.log(placedWord);
    console.log($scope.correctWord);
    // save current attempt timestamp
    var currentTime = Date.now();
    SpellingFactory.timeSave(currentTime);

    placedWord = placedWord.reduce(function(start, index){
      return start + index;
    });
    if(placedWord === $scope.correctWord){
      $scope.correctAnswer = true;
      SpellingFactory.setComplete();
      SpellingFactory.setScore();
    } else {
      $scope.incorrectAnswer = true;
      SpellingFactory.setComplete();
    }

  }; // end checkSpelling function

  function placeGrapheme(){
    j = 0;
    for (var i = 0; i < targetArray.length; i++) {
      if(i >= graphemeIndex && i <= (graphemeIndex + (Graph.length - 1))){
        $scope.placedWord.push({letter: splitGraph[j], placedIndex: i});
        j++;
      } else {
        $scope.placedWord.push({letter: "_", placedInex: -1});
      }
    }
    // console.log($scope.placedWord);
  } // end placeGrapheme function

  $scope.correctPlacement = function(placedWord){
    placedWord = placedWord.map(function(index){
      return index.letter;
    });
    $scope.change = [];
    for(var i = 0; i < $scope.correctWord.length; i++){
      if(placedWord[i] == $scope.correctWord[i]){
        console.log(true);
        $scope.change[i] = true;
      }
    }
  };

  if (SpellingFactory.getDataOut().complete) {
    //if score is greater than 0
    if (SpellingFactory.getDataOut().score) {
      $scope.correctAnswer = true;
      $scope.allLetter = [];
      $scope.placedWord = $scope.correctWord.split('').map(function(index){
        return {
          letter: index,
          placedIndex: -1
        }
      });
      $scope.correctPlacement($scope.placedWord);
      //***********FILL SENTENCE BLANK*******************//
    } else {
      $scope.incorrectAnswer = true;
    }
  }
}]); // end controller
