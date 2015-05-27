module ngApp.cart.models {
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;
  import IUserService = ngApp.components.user.services.IUserService;
  import IProjectsService = ngApp.projects.services.IProjectsService;

  function arrayToObject(array) {
    var obj = {};
    array.forEach(function (elem) {
      obj[elem.id] = elem.val;
    })
    return obj;
  }

  angular.module("cart.table.model", [])
         .factory("CartTableModel", function(ProjectsService: IProjectsService) {
    var CartTableModel: TableiciousConfig = {
      title: 'Cart',
      order: ['my_projects', 'access', 'file_name', 'participantId', 'projects', 'data_type', 'data_format', 'file_size', 'annotationIds'],
      headings: [
        {
          displayName: "file_actions",
          id: "file_actions",
          compile: function ($scope) {
            $scope.file = arrayToObject($scope.row);
            var htm = '<div select-single-cart file="file"></div>' +
                      "<button class='btn btn-primary' download-button files='file' data-tooltip='Download file' data-tooltip-placement='top'>" +
                      "<i class='fa fa-download'></i></button>" +
                      "<button class='btn btn-default' remove-single-cart file='file' data-tooltip='Remove from Cart' data-tooltip-placement='top'>" +
                      "<i class='fa fa-trash-o'></i></button>";
            return htm;
          },
          fieldClass: "table-compile-cell text-center",
          noTitle: true,
          visible: true
        },
        {
          displayName: "My Projects",
          id: "my_projects",
          enabled: function (scope) {
            return scope.UserService.currentUser;
          },
          icon: function (field, row, scope) {
            var projects = _.find(row, function (elem) {
              return elem.id === 'projects';
            }).val;

            var UserService: IUserService = scope.UserService;
            return UserService.isUserProject({projects: projects}) ? 'check' : 'close';
          }
        },
        {
          displayName: "Access",
          id: "access",
          visible: true,
          icon: function (field) {
            return field && field.val === 'protected' ? "lock" : "unlock";
          },
          template: function () {
            return '';
          },
          toolTipText: function(field) {
            return field.val === 'protected' ? "Protected File" : "Open file";
          }
        },
        {
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
          fieldClass: "truncate-cell",
          toolTipText: function (field) {
            return field.val;
          }
        },
        {
          displayName: "Cases",
          id: "participantId",
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
                state: "/participants/" + participants[0]
              };
            }
          },
          fieldClass: 'text-right'
        }, {
          displayName: "Project",
          id: "projects",
          visible: true,
          template: function (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope) {
            var projects: TableiciousEntryDefinition = _.find(row, function (a: TableiciousEntryDefinition) {
              return a.id === 'projects'
            }).val;
            if (projects.length) {
              if (projects.length === 1) {
                return projects[0];
              }

              return projects.length;
            }
          },
          sref: function (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope) {
            var projects: TableiciousEntryDefinition = _.find(row, function (a: TableiciousEntryDefinition) {
              return a.id === 'projects'
            }).val;
            if (projects.length === 1) {
              return {
                state: "/projects/" + projects[0]
              };
            }

            if (projects.length > 1) {
              var filters = $filter("makeFilter")([{name: "project_id", value: projects}]);
              return {
                state: "/projects/t",
                filters: filters
              };
            }
          },
          sortable: true,
          toolTipText: function(field)  {
            return ProjectsService.projectIdMapping[field.val];
          }
        },
        {
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
        },
        {
          displayName: "Annotations",
          id: "annotationIds",
          visible: true,
          template: function (field, row) {
            var ret = field && field.val ? field.val.length : "0";

            return ret;
          },
          sref: function (field, row, scope, $filter) {
            var annotationIds = _.find(row, (item) => {
              return item.id === "annotationIds";
            }).val;

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
        }
      ]
    };
    return CartTableModel;
  });
}
