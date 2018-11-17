const isNumber = require('util').isNumber;
const words: string[] = require('an-array-of-english-words');

const getUniqueRandom = (len: number, used: number[] ) => {
  let index = Math.floor(Math.random() * len);
  while (used.indexOf(index) > -1) {
    index = Math.floor(Math.random() * len);
  }
  used.push(index);
  return index;
};

const shuffle = (a) => {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
};

export interface WordGameResults {
  readonly picked: Choice[];
  readonly indexes: number[];
  readonly letters: string[];
  readonly correct: Choice;
}

export interface WordGameVerification {
  readonly isCorrect: boolean;
  readonly matches: VerificationInstance[];
}

export interface VerificationInstance {
  letter: string;
  isCorrect: boolean;
  index: number;
}
export interface Choice {
  word: string;
  index: number;
  letter: string;
}

export const wordPuzzleVerifier = (results: WordGameResults, chosen: number): WordGameVerification => {
  const chosenWord = results.picked[chosen];
  const correct = results.correct;
  const matches: VerificationInstance[] =
    chosenWord.word.split('').map((letter, index) => ({letter, index, isCorrect: letter === correct[index]}));
    return {isCorrect: chosenWord === correct, matches};
};

export const wordPuzzleGenerator = (wordLen: number, constraint: number): WordGameResults => {
  const usedLetters: number[] = [];
  const vowls = ['a', 'e', 'i', 'o', 'u', 'y'];
  const vowlIndexes = Array(Math.floor(constraint / 2)).fill(0).map(() => getUniqueRandom(vowls.length, usedLetters));
  const letters = vowlIndexes.map((index) => vowls[index]);
  const usedIndexes: number[] = [];
  const indexes = Array(Math.floor(constraint / 2)).fill(0).map(() => getUniqueRandom(wordLen, usedIndexes));
  const wordsOfProperLength = words.filter(word => word.length === wordLen);
  const wordsForLetters = letters.map((letter) => wordsOfProperLength.filter((word) => {
    const firstIndex = word.indexOf(letter);
    return word.lastIndexOf(letter) === firstIndex && firstIndex > -1;
  }));
  const wordsForLettersIndexed = wordsForLetters.map((wordsForLetter, letterIndex) => {
    const wordsLetterPos: string[][] = Array(wordLen).fill([]).map(() => []);
    wordsForLetter.forEach((word) => {
      const letterPosInWord = word.indexOf(letters[letterIndex]);
      wordsLetterPos[letterPosInWord].push(word);
    });
    return wordsLetterPos;
  });
  const picked: Choice[] = [];
  wordsForLettersIndexed.forEach((wordsForLetterIndexed, index) => {
    indexes.forEach((letterIndex) => {
      const wordsIndexed = wordsForLetterIndexed[letterIndex];
      const wordIndex = getUniqueRandom(wordsIndexed.length - 1, []);
      picked.push({word: wordsIndexed[wordIndex], index: letterIndex, letter: vowls[vowlIndexes[index]]});
      for (let i = 0; i < constraint; i++) {
      }
    });
  });
  shuffle(picked);
  const correct = picked[getUniqueRandom(picked.length - 1, [])];
  return {picked, indexes, letters, correct};
};

