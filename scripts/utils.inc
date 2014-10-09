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

focus() {
  echo "${WHITE}$1${NORMAL}"
}

echo_success() {
  printf "\\033[${COL}G %s\n" ${OK}
}

echo_failure() {
  printf "\\033[${COL}G %s\n" ${FAIL}
  printf "${RED}!${NORMAL} "
  printf "$1"
  exit 1
}

usage() {
  echo "Usage: ${0} ${ARG_DEFS[@]}"
  exit 1
}

# readJsonProp(jsonFile, property)
# - restriction: property needs to be on a single line!
readJsonProp() {
  echo $(sed -En 's/.*"'$2'"[ ]*:[ ]*"(.*)".*/\1/p' $1)
}

# replaceInFile(file, findPattern, replacePattern)
replaceInFile() {
  sed -i .tmp -E "s/$2/$3/" $1
  rm $1.tmp
}

# replaceJsonProp(jsonFile, propertyRegex, valueRegex, replacePattern)
# - note: propertyRegex will be automatically placed into a
#   capturing group! -> all other groups start at index 2!
replaceJsonProp() {
  replaceInFile $1 '"('$2')"[ ]*:[ ]*"'$3'"' '"\1": "'$4'"'
}