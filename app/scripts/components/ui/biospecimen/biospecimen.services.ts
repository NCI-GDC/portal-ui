module ngApp.components.ui.biospecimen.services {

  import IBiospecimenController = ngApp.components.ui.biospecimen.controllers.IBiospecimenController;

  export interface IBiospecimenService {
    hierarchy: [[{}]]
    expandAll(event: any, participant: any, expand: boolean): void;
    allExpanded(participant): boolean;
    search(searchTerm: string, participant: any, fields: string[]): any[]
  }

  class BiospecimenService implements IBiospecimenService {
    hierarchy: [[{}]] = [
      [{s: "sample", p: "samples"}],
      [{s: "portion", p: "portions"}],
      [{s: "slide", p: "slides"}, {s: "analyte", p: "analytes"}],
      [{s: "aliquot", p: "aliquots"}]
    ];

    expandAll(event: any, participant: any, expand: boolean): any {
      var self = this;
      participant.biospecimenTreeExpanded = expand;
      if (event.which === 1 || event.which === 13) {
        (function expandAll (entity, depth) {
          if (depth === self.hierarchy.length) return;
          self.hierarchy[depth].forEach(type => {
            (entity[type.p] || []).expanded = entity.expanded = expand;
            (entity[type.p] || []).forEach(entity => expandAll(entity, depth + 1));
          });
        })(participant, 0);
      }
      return participant;
    }

    allExpanded(participant: any): any {
      var self = this;
      return (function allExpanded (entity, depth) {
          if (depth === self.hierarchy.length) return true;
          return self.hierarchy[depth].every(type => {
            if (entity[type.p]) {
              return (entity[type.p] || []).expanded && entity.expanded &&
                (entity[type.p] || []).every(entity => allExpanded(entity, depth + 1));
            } else return entity.expanded;
          });
        })(participant, 0);
    }

    search(searchTerm: string, participant: any, fields: string[]) {
      var self = this;
      var found = [];
      var loweredSearchTerm = searchTerm.toLowerCase();

      function search (entity, type, parents, depth) {
        if (depth === self.hierarchy.length + 1) return;
        if ((fields || []).some(f => (entity[f] || '').toLowerCase().indexOf(loweredSearchTerm) > -1)) {
          parents.forEach(p => p.expanded = true);
          entity.expanded = true;
          found.push({ entity: entity, type: type });
        }
        (self.hierarchy[depth] || []).forEach(type => {
          (entity[type.p] || []).forEach(child => {
            search(child, type.s, [entity[type.p], entity].concat(parents), depth + 1)
          });
        });
      }

      (participant.samples || []).forEach(sample =>
        search(sample, 'sample', [participant.samples], 1)
      );

      return found;
    }
  }

  angular
    .module("biospecimen.services", [])
    .service("BiospecimenService", BiospecimenService);
}
