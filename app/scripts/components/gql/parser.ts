module ngApp.components.gql.parser {
    
    import IGqlLexerService = ngApp.components.gql.lexer.IGqlLexerService; 
    import IGDCWindowService = ngApp.core.models.IGDCWindowService;
    
    export interface IGqlParserService {
        parse(s: any): any;
    }
    
    class GqlParserService implements IGqlParserService {
        private _Parser;
        private _extendToken;
        private _Lexer;
        
        /* @ngInject */
        constructor(
        $window: IGDCWindowService,
        private GqlLexerService: IGqlLexerService
        ) { 
            this._Parser = $window.chevrotain.Parser;
            this._extendToken = $window.chevrotain.extendToken;
            this._Lexer = $window.chevrotain.Lexer;
        }
    
        
        parse(input: string): any {
            var T = this.GqlLexerService;
            var Parser = this._Parser;
            var extendToken = this._extendToken;
            var Lexer = this._Lexer;
            
            function GQLParser(input: string): any {
                Parser.call(this, input, T.allTokens);
                var $ = this;


                this.selectStatement = $.RULE("selectStatement", function () {
                var select, from, where
                select = $.SUBRULE($.selectClause)
                from = $.SUBRULE($.fromClause)
                $.OPTION(function () {
                    where = $.SUBRULE($.whereClause)
                })

                // a parsing rule may return a value.
                // In this case our AST is is a simple javascript object.
                // Generally the returned value may be any javascript value.
                return {
                    type: "SELECT_STMT", selectClause: select,
                    fromClause: from, whereClause: where
                }
                });


                this.selectClause = $.RULE("selectClause", function () {
                var columns = []

                $.CONSUME(T.Select);
                $.AT_LEAST_ONE_SEP(T.Comma, function () {
                    // accessing a token's string via .image property
                    columns.push($.CONSUME(T.Identifier).image);
                }, "column name");

                return {type: "SELECT_CLAUSE", columns: columns}
                });


                this.fromClause = $.RULE("fromClause", function () {
                var table

                $.CONSUME(T.From);
                table = $.CONSUME(T.Identifier).image;

                return {type: "FROM_CLAUSE", table: table}
                });


                this.whereClause = $.RULE("whereClause", function () {
                var condition
                // debugger;

                $.CONSUME(T.Where)
                // a SUBRULE call will return the value the called rule returns.
                condition = $.SUBRULE($.expression)

                return {type: "WHERE_CLAUSE", condition: condition}
                });


                this.expression = $.RULE("expression", function () {
                var lhs, operator, rhs

                lhs = $.SUBRULE($.atomicExpression);
                operator = $.SUBRULE($.relationalOperator);
                rhs = $.SUBRULE2($.atomicExpression);

                return {type: "EXPRESSION", lhs: lhs, operator: operator, rhs: rhs}
                });


                this.atomicExpression = $.RULE("atomicExpression", function () {
                // @formatter:off
                return $.OR([ // OR returns the value of the chosen alternative.
                    {ALT: function(){ return $.CONSUME(T.Integer)}},
                    {ALT: function(){ return $.CONSUME(T.Identifier)}}
                ]).image;
                // @formatter:on
                });


                this.relationalOperator = $.RULE("relationalOperator", function () {
                // @formatter:off
                return $.OR([
                    {ALT: function(){ return $.CONSUME(T.GreaterThan)}},
                    {ALT: function(){ return $.CONSUME(T.LessThan)}}
                ]).image;
                // @formatter:on
                });


                // very important to call this after all the rules have been defined.
                // otherwise the parser may not work correctly as it will lack information
                // derived during the self analysis phase.
                Parser.performSelfAnalysis(this);
            }
            
            GQLParser.prototype = Object.create(Parser.prototype);
            GQLParser.prototype.constructor = GQLParser;
            
            return new GQLParser(input);
        }  
    }
    
    
    angular.module("gql.parser", [
        "gql.lexer"
    ])
    .service("GqlParserService", GqlParserService);
}

