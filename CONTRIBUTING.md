- [Development Practices](#development-practices)
- [Version Control](#version-control)

# Development Practices
- [Git Templates](#git-templates)
- [Feature Pattern](#feature-pattern)
- [Page Object Pattern](#page-object-pattern)
- [SUIT CSS naming conventions](#suit-css-naming-conventions)

## Git Templates
Use the general [git templates](https://github.com/NCI-GDC/git-templates) for NCI-GDC project. Follow the instruction [here](https://github.com/NCI-GDC/git-templates#setup-git-templates) to setup for global config or for this particular repo. It contains git hooks to do security scanning for each commit, as well as other type checkings to insure the consistency of coding format.

## Feature Pattern

Feature pattern can simplify development

*References*

- https://medium.com/opinionated-angularjs/scalable-code-organization-in-angularjs-9f01b594bf06
- https://github.com/mgechev/angularjs-in-patterns
- http://blog.mgechev.com/2014/05/08/angularjs-in-patterns-part-1-overview-of-angularjs/
 
## Page Object Pattern

Page Object pattern can simplify testing

*References*

- https://github.com/angular/protractor/blob/master/docs/page-objects.md
- http://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
- https://teamgaslight.com/blog/getting-started-with-protractor-and-page-objects-for-angularjs-e2e-testing
- http://spin.atomicobject.com/2014/08/08/page-objects-angular-protractor-specs/

# SUIT CSS naming conventions

We use the component naming system for css classes based on SUIT CSS.

*References*

- https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md
- http://atendesigngroup.com/blog/component-element-modifier-design-pattern
- http://smacss.com/book/type-module
- http://bem.info/method/definitions/
- https://github.com/montagejs/montage/wiki/Naming-Conventions


# Version Control

- [Branches](#branches)
- [Commits](#commits)
- [Code Review](#code-review)
- [Rebase](#rebase)
- [Merge Branch](#merge-branch)
- [Tags](#tags)
- [Signed Commits](#signed-commits)
- [Master Branch](#master-branch)
- [Release](#release)
- [Workflow](#workflow)

## Branches
All development should happen on a branch not on master. Branches should formatted as `type/GDC-##-couple-words` or `type/very-short-description`.

This branch structure is similar to git flow but customized for our use cases. Also we are not using git flow directly because it has an inflexible release process.

```
❯ git checkout -b feat/GDC-11-my-feature
```

*References*

- http://nvie.com/posts/a-successful-git-branching-model/

## Commits

Commit messages follow a combination of guidelines set by Angular and Tim Pope.

Examples of valid commits:
 
```
type(scope): one line description (50 char or less)
```

```
type(scope): one line description (50 char or less)

Longer description (70 or less)
- list of changes
- one more thing
```

```
type(scope): one line description (50 char or less)

Longer description (70 or less)
- list of changes
- one more thing

Closes ##, ##
Closes ##
```

This format is automatically checked by a pre commit git hook.

*References*

- http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
- http://addamhardy.com/blog/2013/06/05/good-commit-messages-and-enforcing-them-with-git-hooks/
- https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#

## Code Review

All branches should be pushed to [Github](https://github.com/NCI-GDC/portal-ui) for code review. 

Any branches containing significant work need to be reviewed and signed-off before they can be considered complete.

## Rebase
*References*

```
❯ git rebase -i master
```

- https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase-i

## Merge Branch

Branches can only be merged after the following is completed:

0. Rebased
0. Signed Off
0. Tested by CI

## Tags

```
❯ git tag -s 1.2.3
```

*References*

- http://git-scm.com/book/en/Git-Basics-Tagging

## Signed Commits

Tags should be signed.

### Generating a PGP Key
```
❯ brew install gpg 
❯ gpg --gen-key
❯ gpg --list-secret-keys | grep "^sec"
[gpg-key-id]
❯ git config user.signingkey [gpg-key-id]
```

### Adding a maintainer key
```
❯ gpg -a --export [gpg-key-id] | git hash-object -w --stdin
[object SHA]
❯ git tag -a [object SHA] maintainer-pgp-pub
```

*References*

- http://mikegerwitz.com/papers/git-horror-story
- https://fedoraproject.org/wiki/Creating_GPG_Keys
- http://www.javacodegeeks.com/2013/10/signing-git-tags.html
- https://coderwall.com/p/d3uo3w
- http://git.661346.n2.nabble.com/GPG-signing-for-git-commit-td2582986.html

## Master Branch

No development should happen on the master branch and tests should never be broken.

## Release

### Version Schema

Version number are based on the current stage of development, in the form:

```
0.{Phase}.{Month}-spr{Sprint}
```

For example the version `0.1.8-spr3` represents `Phase 1`, `Monthly deadline 8`, `Sprint 3`

### Prepare release

```
❯ ./release -v 1.1.1 -a prepare
Preparing release for 1.1.1...                              OK
Checking that there are no uncommited items...              OK
Checking that 1.1.1 is greater than 1.1.1-beta...           OK
Updating from 1.1.1-beta to 1.1.1...                        OK
...
Generating changelog from 1.1.1 to HEAD...
Parsed 2 commits.
```

... make any final changes to docs here if needed ...

### Publish release

```
❯ ./release -v 1.1.1 -a publish
[master 7d94010] chore(release): Release 1.1.1
 2 files changed, 14 insertions(+), 1 deletion(-)

You need a passphrase to unlock the secret key for
user: "{Maintinear Info}"
2048-bit RSA key, ID {Maintainer Key}, created 2014-10-01

Counting objects: 13, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (12/12), done.
Writing objects: 100% (13/13), 1.92 KiB | 0 bytes/s, done.
Total 13 (delta 6), reused 0 (delta 0)
To git@github.com:nci-gdc/portal-ui.git
 * [new tag]         1.1.1 -> 1.1.1
Total 0 (delta 0), reused 0 (delta 0)
To git@github.com:nci-gdc/portal-ui.git
   5a22164..7d94010  master -> master
```

### Start next release

```
❯ ./release.sh -v 1.1.2-beta -a next
Preparing release for 1.1.2-beta...                         OK
Checking that there are no uncommited items...              OK
Checking that 1.1.2-beta is greater than 1.1.1...           OK
Updating from 1.1.1 to 1.1.2-beta...                        OK
[master fd6ced3] chore(release): Start Development on 1.1.2-beta
 1 file changed, 1 insertion(+), 1 deletion(-)
Counting objects: 3, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 329 bytes | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)
To git@github.com:nci-gdc/portal-ui.git
   7d94010..fd6ced3  master -> master
```

## Workflow
0. clone the repo, git init with [template](#git-templates)
0. create a new [branch](#branches)
0. do some [work](#development-practices)
0. [commit](#commits) your changes
0. push changes to Github for [review](#code-review)
0. repeat 2-4 as necessary
0. [rebase](#rebase) master into your branch and deal with any conflicts.
0. get someone to [review and sign-off](#code-review) on your branch
0. wait for the CI system to test your branch
0. have your branch [merged](#merge-branch) into master
0. repeat 1-9 until sprint complete
0. run [release](#release) process
