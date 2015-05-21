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
        filters: filter
      };
    }
  }

  var searchTableFilesModel: TableiciousConfig = {
    title: 'Files',
    order: ['add_to_cart', 'download', 'my_projects', 'access', 'file_name', 'participants', 'participants.project.project_id', 'data_type', 'data_format', 'file_size', 'annotations'],
    headings: [
      {
        displayName: "add_to_cart",
        id: "add_to_cart",
        compile: function ($scope) {
          $scope.arrayRow = arrayToObject($scope.row);
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
          $scope.file = arrayToObject($scope.row);
          var htm = '<a class="btn btn-primary" download-button files=file>' +
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
            state: "/files/" + uuid.val
          };
        },
        sortable: true,
        fieldClass: 'truncated-cell'
      }, {
        displayName: "Participants",
        id: "participants",
        visible: true,
        template: function (field, row, scope) {
          var participants = field.val;
          if (participants) {
            return participants.length;
          }
        },
        sref: function (field, row, scope, $filter) {
          var participants = field.val;
          if (participants.length > 1) {
            var file_id = _.find(row, (item) => {
              return item.id === "file_id"
            }).val;

            var filters = $filter("makeFilter")([{name: "files.file_id", value: file_id}]);
            return {
              state: "/search/p",
              filters: filters
            };
          }

          if (participants) {
            return {
              state: "/participants/" + participants[0].participant_id
            };
          }
        },
        fieldClass: 'text-right'
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
        compile: function ($scope) {
          var participants = _.result(_.findWhere($scope.row, {'id': 'participants'}), 'val'),
              href, projectNames, projectVal;

          if (participants.length === 1) {
            href = "/projects/" + participants[0].project.project_id;
            projectNames = participants[0].project.name;
            projectVal = participants[0].project.project_id;
          } else if (participants.val.length > 1) {
            var projects = _.map(participants, (participant: TableicousEntryDefinition) => {
              return {
                project_id: participant.project.project_id
              };
            });

            var projectId = _.unique(_.map(projects, (project) => {
              return project.project_id;
            }));

            if (projectId.length === 1) {
              href = "/projects/" + participants[0].project.project_id;
              projectNames = participants[0].project.name;
              projectVal = participants[0].project.project_id;
            } else {
              var filters = $filter("makeFilter")([{name: "project_id", value: projectId}]);

              projectNames = _.map(participants, (participant: TableicousEntryDefinition) => {
                return participant.project.name;
              }).join("<br />");
              projectVal = projectId.length;
              href = "/projects/t?filters=" + angular.fromJson(filters);
            }
          }

          var htm = '<a data-ng-href="' + href + '" data-tooltip="' + projectNames +
                    '" tooltip-append-to-body="true" tooltip-placement="right">' + projectVal + '</a>';
          return htm;
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

          if (!annotations) {
            return;
          }

          var annotationIds = _.map(annotations.val, (annotation: any) => {
            return annotation.annotation_id;
          });

          if (annotationIds.length > 1) {
            var filter = $filter("makeFilter")([{name: 'annotation_id', value: annotationIds}]);
            return {
              state: "/annotations",
              filters: filter
            };
          } else if (annotationIds.length === 1) {
            return {
              state: "/annotations/" + annotationIds[0]
            };
          }
        },
        fieldClass: 'text-right'
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
      "platform",
      "annotations.annotation_id",
      "related_files.file_id",
      "archive.archive_id"
    ],
    expand: [
      "participants",
      "participants.project",
      "participants.clinical"
    ]
  };
  angular.module("search.table.files.model", [])
      .value("SearchTableFilesModel", searchTableFilesModel);
}
