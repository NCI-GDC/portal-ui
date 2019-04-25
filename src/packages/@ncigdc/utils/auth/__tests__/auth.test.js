import {
  isUserProject,
  userCanDownloadFile,
  userCanDownloadFiles,
  fileInCorrectState,
  intersectsWithFileAcl,
  userProjectsCount,
} from '..';

const projectLessUser = {
  username: 'iamprojectless',
  projects: {},
};

const user = {
  username: 'TEST_USER',
  projects: {
    phs_ids: {
      TEST: [
        'read',
        'create',
        'update',
        'download',
        'release',
        '_member_',
        'read_report',
        'delete',
      ],
    },
    gdc_ids: {
      'TCGA-TEST': [
        'read',
        'create',
        'update',
        'release',
        'download',
        '_member_',
        'read_report',
        'delete',
      ],
      'TCGA-LUAD': [
        'read',
        'create',
        'update',
        'release',
        'download',
        '_member_',
        'read_report',
        'delete',
      ],
      'TCGA-LAML': [
        'read',
        'create',
        'update',
        'release',
        'download',
        '_member_',
        'read_report',
        'delete',
      ],
    },
  },
};

const TESTCase = { node: { project: { project_id: 'TCGA-TEST' } } };
const LUADCase = { node: { project: { project_id: 'TCGA-LUAD' } } };
const KIRPCase = { node: { project: { project_id: 'TCGA-KIRP' } } };
const KIRCCase = { node: { project: { project_id: 'TCGA-KIRC' } } };

const TESTFile = { cases: { hits: { edges: [TESTCase] } } };
const LUADFile = { cases: { hits: { edges: [LUADCase] } } };
const KIRPFile = { cases: { hits: { edges: [KIRPCase] } } };
describe('isUserProject', () => {
  it('should not fail on a projectless user with a project object', () => {
    expect(
      isUserProject({
        user: projectLessUser,
        file: { projects: [{ project_id: 'TCGA-TEST' }] },
      }),
    ).toBe(false);
  });

  it('should not fail on a projectless user without a project object', () => {
    expect(
      isUserProject({
        user: { username: 'bleh' },
        file: { projects: [{ project_id: 'TCGA-TEST' }] },
      }),
    ).toBe(false);
  });
  it('should detect projects directly under file', () => {
    it('with only one project', () => {
      expect(
        isUserProject({
          user,
          file: { projects: [{ project_id: 'TCGA-TEST' }] },
        }),
      ).toBe(true);
      expect(
        isUserProject({
          user,
          file: { projects: [{ project_id: 'TCGA-KIRC' }] },
        }),
      ).toBe(false);
    });
    it('with more than one project, only one of them needs to be in gdc_ids', () => {
      expect(
        isUserProject({
          user,
          file: {
            projects: [
              { project_id: 'TCGA-TEST' },
              { project_id: 'TCGA-LUAD' },
            ],
          },
        }),
      ).toBe(true);
      expect(
        isUserProject({
          user,
          file: {
            projects: [
              { project_id: 'TCGA-TEST' },
              { project_id: 'TCGA-KIRC' },
            ],
          },
        }),
      ).toBe(true);
      expect(
        isUserProject({
          user,
          file: {
            projects: [
              { project_id: 'TCGA-KIRP' },
              { project_id: 'TCGA-TEST' },
              { project_id: 'TCGA-KIRC' },
            ],
          },
        }),
      ).toBe(true);
    });
  });
  it('should detect projects directly under file.cases', () => {
    it('with only one project', () => {
      expect(isUserProject({ user, file: TESTFile })).toBe(true);
      expect(isUserProject({ user, file: LUADFile })).toBe(true);
      expect(isUserProject({ user, file: KIRPFile })).toBe(false);
    });
    it('with more than one project, only one of them needs to be in gdc_ids', () => {
      expect(
        isUserProject({
          user,
          file: {
            cases: {
              hits: {
                edges: [TESTCase, LUADCase],
              },
            },
          },
        }),
      ).toBe(true);
      expect(
        isUserProject({
          user,
          file: {
            cases: {
              hits: {
                edges: [TESTCase, KIRPCase],
              },
            },
          },
        }),
      ).toBe(true);
      expect(
        isUserProject({
          user,
          file: {
            cases: {
              hits: {
                edges: [KIRCCase, KIRPCase],
              },
            },
          },
        }),
      ).toBe(false);
    });
  });
});

describe('fileInCorrectState', () => {
  it('should be correct for active files when file.state is submitted', () => {
    expect(fileInCorrectState({ state: 'submitted' })).toBe(true);
    expect(fileInCorrectState({ state: 'processing' })).toBe(false);
    expect(fileInCorrectState({ state: 'uploaded' })).toBe(false);
  });
});

describe('intersectsWithFileAcl', () => {
  it('should detect _member_ role phsids_ has intersection with file.acl', () => {
    expect(intersectsWithFileAcl({ user, file: { acl: ['TEST'] } })).toBe(true);
    expect(
      intersectsWithFileAcl({ user, file: { acl: ['TEST', 'NOT IN'] } }),
    ).toBe(true);
    expect(intersectsWithFileAcl({ user, file: { acl: ['NOT IN'] } })).toBe(
      false,
    );
  });
});

describe('userCanDownloadFiles', () => {
  it('should work on files with projects', () => {
    expect(userCanDownloadFiles({ user, files: [{ access: 'open' }] })).toBe(
      true,
    );
    expect(
      userCanDownloadFiles({
        user,
        files: [{ access: 'controlled', projects: ['TCGA-TEST'] }],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [{ access: 'controlled', projects: ['TCGA-KIRC'] }],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [{ access: 'controlled', projects: ['TCGA-KIRC', 'TCGA-TEST'] }],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          { access: 'controlled', projects: ['TCGA-KIRC', 'TCGA-TEST'] },
          { access: 'controlled', projects: ['TCGA-KIRC'] },
        ],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [TESTFile],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [TESTFile, LUADFile],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          { access: 'open', ...TESTFile },
          { access: 'open', ...KIRPFile },
        ],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          { access: 'controlled', ...TESTFile },
          { access: 'controlled', ...KIRPFile },
        ],
      }),
    ).toBe(false);
  });
  it('should work on files with no projects', () => {
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            state: 'submitted',
            acl: ['TEST'],
          },
        ],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            state: 'submitted',
            acl: ['TEST'],
          },
          {
            state: 'submitted',
            acl: ['NOT-IN'],
          },
        ],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            state: 'uploaded',
            acl: ['TEST'],
          },
        ],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            state: 'submitted',
            acl: [],
          },
        ],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            state: 'submitted',
            acl: ['NOT-IN'],
          },
        ],
      }),
    ).toBe(false);
  });
});
describe('userCanDownloadFile', () => {
  it('works on a single file', () => {
    expect(
      userCanDownloadFile({
        user,
        file: {
          state: 'submitted',
          acl: ['TEST'],
        },
      }),
    ).toBe(true);
    expect(
      userCanDownloadFile({
        user,
        file: {
          state: 'submitted',
          acl: ['NOT-IN'],
        },
      }),
    ).toBe(false);
  });
  it('should not throw when user has no projects', () => {
    expect(
      userCanDownloadFile({
        user: { username: 'TEST_USER' },
        file: TESTFile,
      }),
    ).toBe(false);
    expect(
      userCanDownloadFile({
        user: { username: 'TEST_USER' },
        file: { access: 'open', ...TESTFile },
      }),
    ).toBe(true);
  });
});
describe('userProjectsCount', () => {
  it('should return the correct number of projects', () => {
    expect(userProjectsCount(user)).toBe(4);
  });
});
