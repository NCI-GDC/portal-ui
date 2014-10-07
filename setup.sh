#!/bin/sh

BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
LIME_YELLOW=$(tput setaf 190)
POWDER_BLUE=$(tput setaf 153)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
BRIGHT=$(tput bold)
NORMAL=$(tput sgr0)
BLINK=$(tput blink)
REVERSE=$(tput smso)
UNDERLINE=$(tput smul)

COL=60
OK=${GREEN}OK${NORMAL}
FAIL=${RED}FAIL${NORMAL}
ERR=${RED}!${NORMAL}

file() {
  echo "${WHITE}$1${NORMAL}"
}
echo_success() {
  printf "\\033[${COL}G %s\n" ${OK}
}
echo_failure() {
  printf "\\033[${COL}G %s\n" ${FAIL}
}

SRC_DIR=git_hooks/
SRC_FILE=validate-commit.py
SRC=${SRC_DIR}${SRC_FILE}
TARGET_DIR=.git/hooks/
TARGET_FILE=commit-msg
TARGET_FILE_BAK=${TARGET_FILE}.bak
TARGET=${TARGET_DIR}${TARGET_FILE}
TARGET_BAK=${TARGET_DIR}${TARGET_FILE_BAK}

if [ -e ${TARGET} ]; then
  printf "%s already exists! Backing up to %s..." $(file ${TARGET_FILE}) $(file ${TARGET_FILE_BAK})
  mv ${TARGET} ${TARGET_BAK}

  if [ -e ${TARGET_BAK} ]; then
    echo_success
  else
    echo_failure
    printf "${ERR} An error occurred while trying to backup %s." $(file ${TARGET_FILE})
    exit
  fi
fi

# Link git hook
# ===================================================== #
printf "Setting up %s git hook..." $(file ${TARGET_FILE})
cat <<EOT >> ${TARGET}
#!/bin/sh

exec < /dev/tty
${SRC} \$1
EOT
# ===================================================== #

if [ -e ${TARGET} ]; then
  echo_success
  printf "Making %s executable..." $(file ${TARGET_FILE})
  chmod 755 ${TARGET}
  echo_success
else
  echo_failure
  printf "${ERR} An error occurred while trying to create %s." $(file ${TARGET_FILE})
  exit
fi

printf "Making %s executable..." $(file ${SRC_FILE})
if [ -e ${SRC} ]; then
  chmod 755 ${TARGET}
  echo_success
else
  echo_failure
  printf "${ERR} %s has been moved or deleted" $(file ${SRC})
  exit
fi

# Install Dependencies
printf "Confirming %s is installed..." $(file "Node")
if hash npm 2>/dev/null; then
  echo_success
  printf "Installing %s dependencies...\n" $(file "NPM")
  npm install --quiet
  npm run bower
else
  echo_failure
  printf "${ERR} %s must be installed" $(file "Node")
fi

  printf "${GREEN}Setup Successful!${NORMAL}"