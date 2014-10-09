#!/bin/bash

set -efu -o pipefail

source $(dirname $0)/scripts/utils.inc

readonly SRC_DIR=scripts/git_hooks/
readonly TARGET_DIR=.git/hooks/

preExistCheck() {
  local FILE=$(basename ${1} .py)
  local TARGET=${TARGET_DIR}${FILE}
  local FILE_BAK=${FILE}.bak
  local TARGET_BAK=${TARGET}.bak
  echo ${TARGET}
  if [[ -e ${TARGET} || -L ${TARGET} ]]; then
    printf "$(focus ${FILE}) already exists! Backing up to $(focus ${FILE_BAK})..."
    mv ${TARGET} ${TARGET_BAK}

    if [[ -e ${TARGET_BAK} || -L ${TARGET_BAK} ]]; then
      echo_success
    else
      echo_failure "An error occurred while trying to backup $(focus ${FILE})." 
    fi
  fi  
}

linkHooks() {
  local SRC_FILE=${1}
  local SRC=${SRC_DIR}${SRC_FILE}
  local TARGET_FILE=$(basename ${SRC_FILE} .py)
  local TARGET=${TARGET_DIR}${TARGET_FILE}

  printf "Setting up $(focus ${TARGET_FILE}) git hook..."
  echo "#!/bin/sh" >> ${TARGET}
  echo "exec < /dev/tty" >> ${TARGET}
  echo "${SRC} \$1" >> ${TARGET}

  # ln -s -f ../../${SRC_DIR}${SRC_FILE} ${TARGET}
  if [[ ! -e ${TARGET} ]]; then
    echo_failure "An error occurred while trying to link $(focus ${TARGET_FILE})."
  fi
  echo_success
}

makeExec() {
  local SRC_FILE=${1}
  local SRC=${SRC_DIR}${SRC_FILE}
  local TARGET_FILE=$(basename ${SRC_FILE} .py)
  local TARGET=${TARGET_DIR}${TARGET_FILE}

  printf "Making $(focus ${SRC_FILE}) executable..."
  chmod 755 ${SRC}
  echo_success  

  printf "Making $(focus ${TARGET_FILE}) executable..."
  chmod 755 ${TARGET}
  echo_success
}

installDeps() {
  printf "Confirming %s is installed..." $(focus "Node")
  if ! hash npm 2>/dev/null; then
    echo_failure "$(focus "Node") must be installed"  
  fi
  echo_success
  printf "Installing %s dependencies...\n" $(focus "NPM")
  npm install
}

for file in $(ls ${SRC_DIR}); do
  preExistCheck ${file}
  linkHooks ${file}
  makeExec ${file}
  installDeps ${file}
done

printf "${GREEN}Setup Successful!${NORMAL}"