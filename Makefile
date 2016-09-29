export JIRA_URL = https://jira.opensciencedatacloud.org/browse
export GIT_REPO = NCI-GDC/portal-ui
export NODE_PACKAGE=ncigdc
export NODE_PATH=$(shell pwd)/src/js/packages/routes

PATH := node_modules/.bin:$(PATH)
FDT_DIR := node_modules/hobbes

include $(FDT_DIR)/Makefile
