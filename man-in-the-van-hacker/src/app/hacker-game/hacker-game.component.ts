import { Component, OnInit } from '@angular/core';
import { wordPuzzleGenerator, WordGameResults, wordPuzzleVerifier, WordGameVerification } from '../word-game-service';
import { format } from 'path';

@Component({
  selector: 'app-hacker-game',
  templateUrl: './hacker-game.component.html',
  styleUrls: ['./hacker-game.component.css']
})
export class HackerGameComponent implements OnInit {

  constructor() { }
  public results: WordGameResults;
  public validation: WordGameVerification;
  public status: string;
  public message: string;
  public attempts: number;
  public pickState: string;
  public disable: boolean[];
  public hintLetter: string;
  public hintIndex: string;
  ngOnInit() {
    this.onRetry();
  }

  onRetry() {
    this.attempts = 3;
    this.results = wordPuzzleGenerator(6, 6);
    this.disable = this.results.picked.map( () => false);
    this.status = 'ok';
    this.message = 'Pick One...';
    this.pickState = 'pick';

    this.hintLetter = this.results.correct.letter;
    this.hintIndex = this.results.indexes.map(index => index + 1).reduce((agg, current, index) => {
      let form = ', ';
      form = index === this.results.indexes.length - 1 ? '' : form;
      form = index === this.results.indexes.length - 2 ? ' or ' : form;
      return agg + current + form;
    }, '');
  }

  onClick(index: number) {
    this.disable[index] = true;
    const selected = this.results.picked[index].word;
    this.validation = wordPuzzleVerifier(this.results, index);
    if (!this.validation.isCorrect) {
      this.attempts = this.attempts - 1;
      if (this.attempts <= 0) {
        this.status = 'fail';
        this.message = `'${selected}' wasn't it either. You are out of attempts for this password.`;
        this.pickState = 'retry';
      } else {
        this.status = 'warn';
        this.message = `Sorry, '${selected}' isn't it...`;
      }
    } else {
      this.status = 'pass';
      this.message = 'You got it!';
      this.pickState = 'retry';
    }
  }

}
