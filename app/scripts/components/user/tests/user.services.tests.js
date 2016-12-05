describe('UserService:', function() {
  var UserService;
  beforeEach(module('ngApp.components'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('config', {fake_auth: true});
  }));

  describe('isUserProject:', function () {
    it('if the file has no projects then true', inject(function(UserService) {
      expect(UserService.isUserProject({projects: []})).to.be.true;
    }));

    it('should accept project ids as file.projects.project_id', inject(function(UserService) {
      expect(UserService.isUserProject({projects: [{project_id: 'TCGA-LAML'}]})).to.be.true;
      expect(UserService.isUserProject({projects: [{project_id: 'TCGA-LAML'}, {project_id: 'CGCI-BLGSP'}]})).to.be.true;
      expect(UserService.isUserProject({projects: [{project_id: 'TCGA-BRCA'}]})).to.be.false;
    }));
    it('should accept project ids as file.projects', inject(function(UserService) {
      expect(UserService.isUserProject({projects: ['TCGA-LAML']})).to.be.true;
      expect(UserService.isUserProject({projects: ['TCGA-LAML', 'CGCI-BLGSP']})).to.be.true;
      expect(UserService.isUserProject({projects: ['TCGA-BRCA']})).to.be.false;
    }));
   it('should accept project ids as file.cases.project.project_id', inject(function(UserService) {
      expect(UserService.isUserProject({cases: [{'project': {'project_id': 'TCGA-LAML'}}]})).to.be.true;
      expect(UserService.isUserProject({cases: [{'project': {'project_id': 'TCGA-LAML'}}, {'project': {'project_id': 'CGCI-BLGSP'}}]})).to.be.true;
      expect(UserService.isUserProject({cases: [{'project': {'project_id': 'TCGA-BRCA'}}]})).to.be.false;
    }));
  });
});
