module ngApp.search.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function arrayToObject(array){
        var obj = {};
        array.forEach(function(elem){
            obj[elem.id] = elem.val;
        })
        return obj;
    }

    var searchTableFilesModel: TableiciousConfig = {
        title: 'Files',
        order: ['file_type', 'participants', 'project_name', 'availableData', 'status', 'last_update'],
        headings: [
        {
            displayName: "My Projects",
            id: "my_projects",
            enabled: function(scope){
                return scope.UserService.currentUser;
            },
            icon:function(field,row,scope){
                //debugger;
                var archive = _.find(row,function(elem){return elem.id==='archive'}).val;
                var UserService:any = scope.UserService;
                return (UserService.currentUser.projects.indexOf(archive.disease_code) !== -1) ? 'check' : 'close';

            }
        },{
            displayName: "add_to_cart",
            id: "add_to_cart",
            compile:function($scope){
                $scope.arrayRow = arrayToObject($scope.row);
                var htm = '<div add-to-cart-single file="arrayRow"></div>';
                return htm;
            },
            compileHead:function($scope){
                var htm = '<div add-to-cart-all files="data" paging="paging"></div>';
                return htm;
            },
                noTitle: true,
            visible: true
        }, {
            displayName: "Access",
            id: "data_access",
                visible: true,
            icon:function(field){
                return field && field.val === 'protected' ? "lock" : "unlock";
            },
            template: function(){
                return '';
            }
        }, {
            displayName: "File Name",
            id: "file_name",
                visible: true,
            template:function(field,row,scope){
                return field && field.val && scope.$filter('ellipsicate')(field.val,50);
            },
            sref:function(field,row){
                var uuid = _.find(row,function(a:TableiciousEntryDefinition){return a.id === 'file_uuid'});
                return "file({ fileId: '"+uuid.val+"' })";
            }
        },{
            displayName: "Participants",
            id: "participants",
                visible: true,
            template: function (field,row,scope) {
                var participants = field.val;
                if (participants) {
                    if (participants.length === 1) {
                       return  scope.$filter('ellipsicate')(participants[0].bcr_patient_uuid, 8);
                    } else if (participants.length > 1) {
                        return participants.length;
                    }
                }
            },
            sref: function (field) {
                var participant = field.val;
                if (participant) {
                    return "participant({ participantId : '" + participant[0].bcr_patient_uuid + "' })";
                }
            }
        }, {
            displayName: "Project",
            id: "disease_code",
                visible: true,
            template:function(field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[],scope){
                var arch:TableiciousEntryDefinition = _.find(row,function(a:TableiciousEntryDefinition){return a.id === 'archive'});
                var code:any = arch.val.disease_code;
                return code;
            },
            sref:function (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[],scope) {

                var arch:TableiciousEntryDefinition = _.find(row,function(a:TableiciousEntryDefinition){return a.id === 'archive'});
                var code:any = arch.val.disease_code;

                return "project({ 'projectId':'" + code + "'})";

            }
        }, {
            displayName: "Data Type",
            id: "data_type",
                visible: true
        }, {
            displayName: "Data Format",
            id: "data_format",
                visible: true
        }, {
            displayName: "Size",
            id: "file_size",
                visible: true,
            template:function(field,row,scope){
                //debugger;
                return scope.$filter('size')(field.val);
            }
        },{
            displayName: "Revision",
            id: "revision",
                visible: true,
            template: function(field,row) {
                var archive:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                    return x.id === 'archive';
                });
                return archive.val.revision
            }
        },{
            displayName: "Update date",
            id: "updated",
                visible: true,
            template:function(field,row,scope){
                return scope.$filter('date')(field.val);
            }
        }]
    };
    angular.module("search.table.files.model", [])
        .value("SearchTableFilesModel", searchTableFilesModel);
}