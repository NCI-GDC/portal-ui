describe('UserService:', function() {
  var UserService;
  beforeEach(module('ngApp.components'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('config', {fake_auth: true});
  }));

  describe('isUserProject:', function () {
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

  describe('userCanDownloadFiles:', function () {
    it('can download file in user projects in correct file state', inject(function(UserService) {
      expect(UserService.userCanDownloadFiles([{
        projects: ['TCGA-LAML'],
        acl: [],
        state: 'submitted',
        file_state: 'submitted'}
      ])).to.be.true;
    }));
    it('can download file with no projects but in acl in correct file state', inject(function(UserService) {
      expect(UserService.userCanDownloadFiles([{
        projects: [],
        acl: ['phs000178'],
        state: 'submitted',
        file_state: 'submitted'
      }])).to.be.true;
    }));
   it('cannot download file not in user projects', inject(function(UserService) {
      expect(UserService.userCanDownloadFiles([{
        projects: ['TCGA-DOES-NOT-EXIST'],
        state: 'submitted',
        file_state: 'submitted'}
      ])).to.be.false;
    }));
  it('cannot download file with no projects not in acl', inject(function(UserService) {
      expect(UserService.userCanDownloadFiles([{
        projects: [],
        acl: ['does-not-exist'],
        state: 'submitted',
        file_state: 'submitted'}
      ])).to.be.false;
    }));
  it('cannot download file in incorrect state', inject(function(UserService) {
      expect(UserService.userCanDownloadFiles([{
        projects: ['TCGA-LAML'],
        state: 'submitted',
        file_state: 'redacted'}
      ])).to.be.false;
    }));
  });
});
