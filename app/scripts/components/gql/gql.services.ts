module ngApp.components.gql.services {
  export interface IGqlService {
    tokens: IGqlToken;
    getPos(element: any): number;
    setPos(element: any, caretPos: number): void;
    countNeedle(stack: string, needle: string): number;
    isCountOdd(stack: string, needle: string): boolean;
    unbalanced(stack: string, start: string, end: string): boolean;
    contains(phrase: string, sub: string): boolean;
    clean(e: string): boolean;
  }

  export interface IGqlToken {
    EQ: string;
    NE: string;
    IN: string;
    AND: string;
    OR: string;
    LBRACKET: string;
    RBRACKET: string;
    LPARENS: string;
    RPARENS: string;
    QUOTE: string;
    SPACE: string;
    COMMA: string;
    NOTHING: string;
    PERIOD: string;
  }

  class GqlService implements IGqlService {
    tokens = {
      EQ: "=",
      NE: "!=",
      IN: "in",
      OR: "or",
      AND: "and",
      LBRACKET: '[',
      RBRACKET: ']',
      LPARENS: '(',
      RPARENS: ')',
      QUOTE: '"',
      SPACE: ' ',
      COMMA: ',',
      NOTHING: '',
      PERIOD: '.'
    }
    
    /* @ngInject */
    constructor(
      private $timeout: ng.ITimeoutService,
      private $document: ng.IDocumentService
    ) {    }
    
    
    
    getPos(element) {
      if ('selectionStart' in element) {
        return element.selectionStart;
      } else if (this.$document['selection']) {
        element.focus();
        const sel: any = this.$document['selection'].createRange();
        const selLen: number = this.$document['selection'].createRange().text.length;
        sel.moveStart('character', -element.value.length);
        return sel.text.length - selLen;
      }
    }

    setPos(element, caretPos) {
      if (element.createTextRange) {
        const range = element.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        element.focus();
        if (element.selectionStart !== undefined) {
          this.$timeout(() => element.setSelectionRange(caretPos, caretPos));
        }
      }
    }

    countNeedle(stack: string, needle: string): number {
      // http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript
      return stack.split(needle).length - 1
    }

    isCountOdd(stack, needle) {
      return this.countNeedle(stack, needle) % 2 !== 0;
    }

    unbalanced(stack, start, end) {
      const numStart = this.countNeedle(stack, start);
      const numEnd = this.countNeedle(stack, end);
      return numStart > numEnd;
    }
    
    contains(phrase, sub) {
      if (sub.length === 0) return true;
      var phraseStr = (phrase + "").toLowerCase();
      return phraseStr.indexOf((sub + "").toLowerCase()) > -1;
    }

    clean(e) {
      return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', this.tokens.QUOTE, this.tokens.LPARENS].indexOf(e) == -1;
    }
  }

  angular
      .module("gql.services", [])
      .service("GqlService", GqlService);
}
