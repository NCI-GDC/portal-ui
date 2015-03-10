module ngApp.components.tables.validator {

    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousColumnDefinition = ngApp.components.tables.directives.tableicious.TableiciousColumnDefinition;

    /**
     * This development-only class contains various functions that will validate Tableicious config, data, etc
     * and warn the developer of potential pitfalls.
     */
    class TableiciousValidator {

        /* @ngInject */
        constructor(private $log: ngILogService) {}

        /**
         * Function that outputs warnings regarding the table configuration to the console.
         * @param config
         * The table configuration.
         * @param data
         * The data that will be used.
         */
        validateConfigData(config:TableiciousConfig,data:any[]):void {

            var headingsDefinedByConfig = _.pluck(config.headings,'id');
            var headingsDefinedByData = _.keys(data[0]);

            headingsDefinedByData.forEach((heading) => {
                if (!_.contains(headingsDefinedByConfig,heading)) {
                    this.$log.error('Error generating table, data contains field for which no heading definition found in config: ',heading, '. This entry will be ignored.');
                }
            });

            headingsDefinedByConfig.forEach((heading) => {
                if (!_.contains(headingsDefinedByData,heading)) {
                    this.$log.warn('Config contains definition for entry not found in data: ',heading, '. This field will be blank.');
                }
            });
        }

        /**
         * Outputs a warning to the console if the order array will not function correctly.
         * @param orderArray
         * @param config
         */

        validateOrderObject(orderArray:string[],headings:TableiciousColumnDefinition[]){
            return headings.every((heading:TableiciousColumnDefinition) => {
                if (_.contains(orderArray,heading.id)) {
                    return true;
                } else {
                    this.$log.error("No order specified for heading: ",heading.id);
                }

            });
        }


        /**
         * Returns true if the array passed is an array of objects, and every object has the same structure.
         * @param data
         * @returns {boolean}
         */
        dataIsCongruent(data) {
            var firstHeadings = _.keys(data[0]);

            return data.every((datum) => {
                if (_.isEqual(firstHeadings, _.keys(datum))) {
                    return true;
                } else {
                    this.$log.warn("Warnning - some data in this set does not have the same structure: ",firstHeadings , "is not congruent with ", _.keys(datum));
                    return false;
                }
            })
        }
    }

    angular
        .module("tables.validator",[])
        .service("TableValidator", TableiciousValidator);
}