export JIRA_URL = https://jira.opensciencedatacloud.org/browse
export GIT_REPO = NCI-GDC/portal-ui

PATH := node_modules/.bin:$(PATH)
FDT_DIR := node_modules/frontend-dev-tools

include $(FDT_DIR)/Makefile
