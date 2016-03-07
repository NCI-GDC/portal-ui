module ngApp.components.gql.lexer {
    
    import IGDCWindowService = ngApp.core.models.IGDCWindowService;
    
    export interface IGqlLexerService {
        tokenize(s: string): any;
        Comma: Object;
        Identifier: Object;
        Integer: Object;
        Select: Object;
        From: Object;
        Where: Object;
        GreaterThan: Object;
        LessThan: Object;
        WhiteSpace: any;
        allTokens: [Object];
    }
    
    class GqlLexerService implements IGqlLexerService {
        private _lexer;
        Comma: Object;
        Identifier: Object;
        Integer: Object;
        Select: Object;
        From: Object;
        Where: Object;
        GreaterThan: Object;
        LessThan: Object;
        WhiteSpace: any;
        allTokens: [Object];
        
        /* @ngInject */
        constructor(
        $window: IGDCWindowService
        ) {  
            var extendToken = $window.chevrotain.extendToken;
            var Lexer = $window.chevrotain.Lexer;
            // extendToken is used to create a constructor for a Token class
            // The Lexer's output will contain an array of
            // instances created by these constructors
            
            // Symbols
            this.Comma = extendToken("Comma", /,/);
            this.Identifier = extendToken("Identifier", /\w+/);
            this.Integer = extendToken("Integer", /0|[1-9]\d+/);
            
            // GQL Keywords
            this.Select = extendToken("Select", /select/i);
            this.From = extendToken("From", /from/i);
            this.Where = extendToken("Where", /where/i);
            
            // Op
            this.GreaterThan = extendToken("GreaterThan", /</);
            this.LessThan = extendToken("LessThan", />/);
            
            // Skip
            this.WhiteSpace = extendToken("WhiteSpace", /\s+/);
            this.WhiteSpace.GROUP = Lexer.SKIPPED;

            // whitespace is normally very common so it is placed first to speed up the lexer
            this.allTokens = [
                this.WhiteSpace, 
                this.Select, 
                this.From, 
                this.Where,
                this.Comma,
                this.Identifier, 
                this.Integer, 
                this.GreaterThan, 
                this.LessThan
            ];
            
            this._lexer = new $window.chevrotain.Lexer(this.allTokens, true);
        }
        
        tokenize(s: string): any {
            return this._lexer.tokenize(s);
        }  
    }
    
    
    angular.module("gql.lexer", [])
    .service("GqlLexerService", GqlLexerService);
}

