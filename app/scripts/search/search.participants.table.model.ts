module ngApp.search.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function getFileSref(data_type:string) {
        return function fileSref (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[],scope) {

            return 'tbc';

        }
    }

    var searchParticipantsModel:TableiciousConfig = {
        title: 'Participants',
        order: ['add_to_cart', 'participant_id', 'disease_type', 'availableData', 'gender', 'tumor_stage', 'files', 'last_update'],
        headings: [{
            displayName: "Add to Cart",
            id: "add_to_cart_filtered",
            noTitle: true,
            enabled: true
        },{
            displayName: "Participant ID",
            id: "bcr_patient_barcode",
            enabled: true,
            sref:function(elem,row,scope){
                var uuid:TableiciousEntryDefinition = _.find(row,function(elem:TableiciousEntryDefinition){
                    return elem.id === "bcr_patient_uuid";
                });

                return "participant({ participantId : '"+uuid.val+"' })";
            }
        }, {
            displayName: "Disease Type",
            id: "disease_type",
            enabled: true,
            template:function(elem:TableiciousEntryDefinition,row:TableiciousEntryDefinition[],scope){
                var admin:TableiciousEntryDefinition = _.find(row,function(elem:TableiciousEntryDefinition){
                    return elem.id === 'admin';
                });

                return admin && admin.val && admin.val.disease_code;
            }
        },{
            displayName: "Available Data Files per Data Type",
            id: "availableData",
            headingClass:'text-center',
            enabled: true,
            children: [{
                displayName: 'Clinical',
                id: 'clinical',
                enabled: true,
                sref: getFileSref('Clinical data'),
                template:function(){return 'tbc'}
            }, {
                displayName: 'SNV',
                id: 'snv',
                enabled: true,
                sref: getFileSref('Simple nucleotide variant'),
                template:function(){return 'tbc'}
            }, {
                displayName: 'mrnA',
                id: 'mrna',
                enabled: true,
                sref: getFileSref('mRNA expression'),
                template:function(){return 'tbc'}
            }, {
                displayName: 'miRNA',
                id: 'mirna',
                enabled: true,
                sref: getFileSref('miRNA expression'),
                template:function(){return 'tbc'}
            }, {
                displayName: 'CNV',
                id: 'cnv',
                enabled: true,
                sref: getFileSref('Copy number variant'),
                template:function(){return 'tbc'}
            }, {
                displayName: 'Meth',
                id: 'meth',
                enabled: true,
                sref: getFileSref('DNA methylation')
            }]
        }, {
            displayName: "Gender",
            id: "gender",
            enabled: true,
        }, {
            displayName: "Tumor Stage",
            id: "person_neoplasm_cancer_status",
            enabled: true
        }, {
            displayName: "Files",
            id: "files",
            enabled: true,
            template:function(field){
                return field && field.val && field.val.length;
            }
        }, {
            displayName: "Annotations",
            id: "annotations",
            enabled: true,
            template: function (field) {
                return 'tbc'
            },
            sref: function(){
                return 'annotations';
            }
        }]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}