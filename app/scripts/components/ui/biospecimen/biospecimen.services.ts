module ngApp.components.ui.biospecimen.services {

  import IBiospecimenController = ngApp.components.ui.biospecimen.controllers.IBiospecimenController;

  export interface IEntityType {
    s: string; // singular name
    p: string; // plural name
  }

  export interface IBiospecimenService {
    entityTypes: IEntityType[];
    expandAll(event: any, participant: any, expand: boolean): any;
    allExpanded(participant): boolean;
    search(searchTerm: string, participant: any, fields: string[]): any[];
    stitchPlaceholderChildrenToParents(entities: any[]): void;
  }

  /*
   *  The BiospecimenService has several utility functions for working with the
   *  the biospecimen tree, which is represented by a single node (the participant / case),
   *  with an array of nodes, called entities, each with their own array of nested entities and so on.
   *
   *  It is important to note that although each entity may have children, it is
   *  possible that it itself does not represent an actual file in Elasticsearch
   *  and is simply acting as a placeholder for a child further down the tree.
   */

  class BiospecimenService implements IBiospecimenService {
    entityTypes: IEntityType[] = [
      {s: "sample", p: "samples"},
      {s: "portion", p: "portions"},
      {s: "slide", p: "slides"}, 
      {s: "analyte", p: "analytes"},
      {s: "aliquot", p: "aliquots"}
    ];

    /*  expandAll()
     *  ===========
     *
     *  Expand every node in the tree.
     */

    expandAll(event: any, participant: any, expand: boolean): any {
      var self = this;
      participant.biospecimenTreeExpanded = expand;
      if (event.which === 1 || event.which === 13) {
        (function expandAll (entity) {
          self.entityTypes.forEach(type => {
            (entity[type.p] || []).expanded = entity.expanded = expand;
            (entity[type.p] || []).forEach(entity => expandAll(entity));
          });
        })(participant);
      }
      return participant;
    }

    /*  allExpanded()
     *  ============
     *
     *  Returns `true` if every node is expanded.
     *  Used to determine the state of the expand all / collapse all button.
     */

    allExpanded(participant: any): boolean {
      var self = this;
      return (function allExpanded (entity) {
        return self.entityTypes.every(type => {
          if (entity[type.p]) {
            return (entity[type.p] || []).expanded && entity.expanded &&
              (entity[type.p] || []).every(entity => allExpanded(entity));
          } else return entity.expanded;
        });
      })(participant);
    }

    /*  search()
     *  ========
     *
     *  Recurse through the tree and check whether the given search term matches
     *  the value of any of the node's keys which are specified in the `fields` array.
     *
     *  If there is a match, expand that node and all of its parents, and add the
     *  node to the `found` array, which is returned at the end of the function.
     */

    search(searchTerm: string, participant: any, fields: string[]): any[] {
      var self = this;
      var found = [];
      var loweredSearchTerm = searchTerm.toLowerCase();

      function search (entity, type, parents) {
        if ((fields || []).some(f => (entity[f] || '').toLowerCase().indexOf(loweredSearchTerm) > -1)) {
          parents.forEach(p => p.expanded = true);
          let sampleType = parents.reduce((s, p) => {
            if (p.hasOwnProperty('sample_type')) {
              return p.sample_type;
            }
            return s;
          });
          entity.expanded = true;
          found.push({ entity: entity, type: type, sample_type: sampleType });
        }
        (self.entityTypes || []).forEach(type => {
          (entity[type.p] || []).forEach(child => {
            search(child, type.s, [entity[type.p], entity].concat(parents))
          });
        });
      }

      (participant.samples || []).forEach(sample =>
        search(sample, 'sample', [participant.samples])
      );

      return found;
    }

    /*  stitchPlaceholderChildrenToParents()
     *  ====================================
     * 
     *  Recurse through the nodes looking for the first placeholder with children
     *  and shift the children to the placeholders nearest parent with actual files.
     */

    stitchPlaceholderChildrenToParents(parents: any[]): void {
      var self = this;

      function hasFiles (xs, childTypeSingular) {
        return (xs || []).some(x => x[`${childTypeSingular}_id`] || x.submitter_id);
      }

      (parents || []).forEach(parent => { 
        self.entityTypes.forEach(childType => {
          if (!hasFiles(parent[childType.p], childType.s)) {
            stitchPlaceholderChildrenToParents(parent[childType.p]);
          }
        });
        
        function stitchPlaceholderChildrenToParents (entities) {
          (entities || []).forEach((entity, i) => {
            self.entityTypes.forEach(childType => {
              if (hasFiles(entity[childType.p], childType.s)) {
                parent[childType.p] = parent[childType.p]
                  ? [ ...parent[childType.p], ...entity[childType.p].splice(0, Infinity) ]
                  : [ ...entity[childType.p].splice(0, Infinity) ];
              } else {
                stitchPlaceholderChildrenToParents(entity[childType.p]);
              }
            });  
          });  
        }
      });
    }
  }

  angular
    .module("biospecimen.services", [])
    .service("BiospecimenService", BiospecimenService);
}
