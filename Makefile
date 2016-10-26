export TICKET_URL = https://jira.opensciencedatacloud.org/browse
export GIT_REPO = NCI-GDC/portal-ui

PATH := node_modules/.bin:$(PATH)
FDT_DIR := node_modules/@ncigdc/buildjs

include $(FDT_DIR)-scripts/Makefile
