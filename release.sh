#!/bin/bash

set -ef -o pipefail

source $(dirname $0)/scripts/utils.inc

readonly PACKAGE="package.json"

readonly VERSION_REGEX="^[0-9]+\.[0-9]+\.[0-9]+(\.[0-9]+)?(\-[A-Za-z]+)?$"
readonly ACTION_REGEX="^(prepare|publish|next|retract)$"
readonly COMMIT_SHA_REGEX="(.*)"
readonly ARG_DEFS=(
	"--version=${VERSION_REGEX}"
	"[--action=${ACTION_REGEX}]"
	"[--commit-sha=${COMMIT_SHA_REGEX}]"
)

while [[ $# > 1 ]]; do
	key="$1"
	shift

	case $key in
		-v|--version)
	    VERSION="$1"
	    shift
	    ;;
	    -a|--action)
	    ACTION="$1"
	    shift
	    ;;
	    -c|--commit-sha)
	    COMMIT_SHA="$1"
	    shift
	    ;;
	    *)
	    ;;
	esac
done

if [[ -z ${VERSION} || ! ${VERSION} =~ ${VERSION_REGEX} ||
	  (! -z ${ACTION} && ! ${ACTION} =~ ${ACTION_REGEX}) ||
	  (! -z ${COMMIT_SHA} && ! ${COMMIT_SHA} =~ ${COMMIT_SHA_REGEX}) ]]; then
	usage
fi

set -u

readonly VERSION
readonly ACTION=${ACTION:-"prepare"}
readonly COMMIT_SHA=${COMMIT_SHA:-"HEAD"}

compareVersions() {
	local FROM=${1//"-beta"/}
	local TO=$2
	
	printf "Checking that %s is greater than %s..." $(focus ${TO}) $(focus ${1})
	if [[ ${TO} > ${FROM} || ${TO} == ${FROM} ]]; then
		echo_success
	else
		echo_failure "The next version must be greater than the current version."
	fi
}

updateVersion() {
	local FROM=$1
	local TO=$2
	
	compareVersions ${FROM} ${TO}

	printf "Updating from %s to %s..." $(focus ${FROM}) $(focus ${TO})
	if ! replaceJsonProp ${PACKAGE} "version" ".*" ${TO}; then
		echo_failure "An error occurred while trying to update the development version."	
	fi
	echo_success
}

logs() {
	./node_modules/gulp/bin/gulp.js logs
}

preChecks() {
	printf "Preparing release for %s..." $(focus ${VERSION})
	if git rev-parse ${VERSION}.. >/dev/null 2>&1; then
		echo_failure "tag for ${VERSION} already exists!"
	fi
	echo_success

	printf "Checking that there are no uncommited items..."
	if [[ -n "$(git status --porcelain --ignore-submodules -unormal)" ]]; then
		echo_failure "git is dirty! Please commit or stash your changes."
	fi
	echo_success

	local CURRENT_VERSION=$(readJsonProp ${PACKAGE} "version")

	updateVersion ${CURRENT_VERSION} ${VERSION}
}

prepare() {
	preChecks

	# updates changelog
	logs
}

publish() {
	# tag commit
	git add CHANGELOG.md package.json
	git commit -m "chore(release): Release ${VERSION}"
	git tag -s ${VERSION} -m "chore(release): ${VERSION}" "$COMMIT_SHA"
	git push origin ${VERSION}
	git push origin master
}

next() {
	preChecks

	# commit new version to master
	git add package.json
	git commit -m "chore(release): Start Development on ${VERSION}"
	git push origin master
}

retract() {
	printf "This will remove %s and %s copies of %s\n" $(focus "local") $(focus "remote") $(focus ${VERSION})
	printf "If you wish to continue re-enter the tag name: "
	read TAG
	
	if [[ ${TAG} == ${VERSION} ]]; then
		git tag -d ${VERSION}
		git push origin :refs/tags/${VERSION}
	fi
}

${ACTION}
