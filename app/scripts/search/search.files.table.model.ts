module ngApp.search.models {
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;
  import IUserService = ngApp.components.user.services.IUserService;

  function arrayToObject(array) {
    var obj = {};
    array.forEach(function (elem) {
      obj[elem.id] = elem.val;
    })
    return obj;
  }

  function getAnnotationsSref(data_type: string) {
    return function annotationSref(field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
      var projectId = _.find(row, function (elem) {
        return elem.id === 'project_id';
      }).val;

      var filter = $filter("makeFilter")([{
        name: 'participants.project.project_id',
        value: projectId
      }, {name: 'files.data_type', value: data_type}]);
      return {
        state: "/search/p",
        filters: {
          filters: filter
        }
      };
    }
  }

  var searchTableFilesModel: TableiciousConfig = {
    title: 'Files',
    order: ['file_type', 'participants', 'project_id', 'availableData', 'state', 'last_update'],
    headings: [
      {
        displayName: "add_to_cart",
        id: "add_to_cart",
        compile: function ($scope) {
          $scope.arrayRow = arrayToObject($scope.row); // TODO: the file being passed here is wrong how to fix?
          var htm = '<div add-to-cart-single file="arrayRow"></div>';
          return htm;
        },
        compileHead: function ($scope) {
          var htm = '<div add-to-cart-all files="data" paging="paging"></div>';
          return htm;
        },
        noTitle: true,
        visible: true
      }, {
        displayName: "download",
        id: "download",
        compile: function ($scope) {
          $scope.file = arrayToObject($scope.row); // TODO: the file being passed here is wrong how to fix?
          var htm = '<a class="btn btn-primary" download-button files=file>' +
//          var htm = '<a class="btn btn-primary" download-button data-ng-href="{{ [file.file_id].concat(file.related_ids || []) | makeDownloadLink }}">' +
              '<i class="fa fa-download"></i></a>';
          return htm;
        },
        noTitle: true,
        visible: true
      }, {
        displayName: "My Projects",
        id: "my_projects",
        enabled: function (scope) {
          return scope.UserService.currentUser;
        },
        icon: function (field, row, scope) {
          var participants = _.find(row, function (elem) {
            return elem.id === 'participants'
          }).val;
          var UserService: IUserService = scope.UserService;
          return UserService.isUserProject({participants: participants}) ? 'check' : 'close';
        }
      }, {
        displayName: "Access",
        id: "access",
        visible: true,
        icon: function (field) {
          return field && field.val === 'protected' ? "lock" : "unlock";
        },
        template: function () {
          return '';
        }
      }, {
        displayName: "File Name",
        id: "file_name",
        visible: true,
        template: function (field, row, scope) {
          return field && field.val;
        },
        sref: function (field, row) {
          var uuid = _.find(row, function (a: TableiciousEntryDefinition) {
            return a.id === 'file_id'
          });
          return {
            state: "/files/",
            filters: {
              fileId: uuid.val
            }
          };
        },
        sortable: true,
        fieldClass: 'truncated-cell'
      }, {
        displayName: "Annotations",
        id: "annotations",
        visible: true,
        template: function (field, row) {
          var ret = field && field.val ? field.val.length : "0";

          return ret;
        },
        sref: function (field, row, scope, $filter) {
          var annotations = _.find(row, (item) => {
            return item.id === "annotations";
          });
          var annotationIds = _.map(annotations.val, (annotation: any) => {
            return annotation.annotation_id;
          });

          var filter = $filter("makeFilter")([{name: 'annotation_id', value: annotationIds}]);
          return {
            state: "/annotations",
            filters: {
              filters: filter
            }
          };
        }
      }, {
        displayName: "Participants",
        id: "participants",
        visible: true,
        template: function (field, row, scope) {
          var participants = field.val;
          if (participants) {
            if (participants.length === 1) {
              return participants[0].participant_id;
            } else if (participants.length > 1) {
              return participants.length;
            }
          }
        },
        sref: function (field, row, scope, $filter) {
          var participant = field.val;
          if (field.val.length > 1) {
            var filters = $filter("makeFilter")([{name: "participant.participant_id", value: field.val}]);
            return {
              state: "/search/p",
              filters: {
                filters: filters
              }
            };
          }

          if (participant) {
            return {
              state: "/participants/",
              filters: {
                participantId: participant[0].participant_id
              }
            };
          }
        },
        fieldClass: 'truncated-cell'
      }, {
        displayName: "Project",
        id: "participants.project.project_id",
        visible: true,
        template: function (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope) {
          var participants: TableiciousEntryDefinition = _.find(row, function (a: TableiciousEntryDefinition) {
            return a.id === 'participants'
          });
          if (participants) {
            if (participants.val.length === 1) {
              return participants.val[0].project.project_id;
            } else if (participants.val.length > 1) {
              var projects = _.map(participants.val, (participant: any) => {
                return {
                  project_id: participant.project.project_id
                };
              });

              var projectIds = _.unique(_.map(projects, (project) => {
                return project.project_id;
              }));

              if (projectIds.length === 1) {
                return projectIds[0];
              }

              return projectIds.length;
            }
          }
        },
        sref: function (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope) {
          var participants: TableiciousEntryDefinition = _.find(row, function (a: TableiciousEntryDefinition) {
            return a.id === 'participants'
          });
          if (participants.val.length === 1) {
            return {
              state: "/projects/",
              filters: {
                projectId: participants.val[0].project.project_id
              }
            };
          } else if (participants.val.length > 1) {
            var projects = _.map(participants.val, (participant: TableicousEntryDefinition) => {
              return {
                project_id: participant.project.project_id
              };
            });

            var projectId = _.unique(_.map(projects, (project) => {
              return project.project_id;
            }));

            if (projectId.length === 1) {
              return {
                state: "/projects/",
                filters: {
                  projectId: projects[0].project_id
                }
              };
            }

            var filters = $filter("makeFilter")([{name: "project_id", value: projectId}]);
            return {
              state: "/projects/t",
              filters: {
                filters: filters
              }
            };
          }
        },
        sortable: true
      }, {
        displayName: "Data Type",
        id: "data_type",
        visible: true,
        sortable: true
      }, {
        displayName: "Data Format",
        id: "data_format",
        visible: true,
        sortable: true
      }, {
        displayName: "Size",
        id: "file_size",
        visible: true,
        template: function (field, row, scope) {
          return scope.$filter('size')(field.val);
        },
        sortable: true,
        fieldClass: 'text-right'
      }, {
        displayName: "Update date",
        id: "updated",
        visible: true,
        template: function (field, row, scope) {
          return scope.$filter('date')(field.val);
        }
      }],
    fields: [
      "access",
      "state",
      "file_name",
      "data_type",
      "data_subtype",
      "data_format",
      "file_size",
      "file_id",
      "participants.participant_id",
      "participants.project.name",
      "participants.project.project_id",
      "participants.submitter_id",
      "platform",
      "annotations.annotation_id",
      "related_files.file_id",
      "archive.archive_id"
    ]
  };
  angular.module("search.table.files.model", [])
      .value("SearchTableFilesModel", searchTableFilesModel);
}
