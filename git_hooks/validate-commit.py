#!/usr/bin/env python
"""
Git commit hook:
 .git/hooks/commit-msg
 
 Check commit message according to angularjs guidelines:
  * https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
"""

import sys
import re

import sys, os
from subprocess import call

valid_commit_types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
help_address = 'https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#'

if os.environ.get('EDITOR') != 'none':
    editor = os.environ['EDITOR']
else:
    editor = "vim"

message_file = sys.argv[1]

def header_check(real_lineno, line):
    m = re.search('^(.*)\((.*)\): (.*)$', line)

    if not m or len(m.groups()) != 3:
        return "Line %d: Header does not follow format: type(scope): message" % (real_lineno,)

    commit_type, commit_scope, commit_message = m.groups()

    if commit_type not in valid_commit_types:
        return "Line %d: Commit type not valid. Must be one of:\n#! %s" % (real_lineno,", ".join(valid_commit_types))

    if len(line) > 50:
        return "Line %d: First line should be less than 50 characters in length. (is %d)" % (real_lineno, len(line))


def check_format_rules(lineno, line):
    real_lineno = lineno + 1

    if lineno == 0:
        return header_check(real_lineno, line)

    if lineno == 1 and line:
        return "Line %d: Second line should be empty." % (real_lineno,)

    if not line.startswith('#') and len(line) > 72:
        return "Line %d: No line should be over 72 characters long. (is %d)" % (real_lineno,len(line))

    return False


while True:
    commit_msg = []
    errors = []

    with open(message_file) as commit_fd:
        for lineno, line in enumerate(commit_fd):
            stripped_line = line.strip()
            if not line.startswith('#!'):
                commit_msg.append(line)
                e = check_format_rules(lineno, stripped_line)
                if e:
                    errors.append(e)

    with open(message_file, 'w') as commit_fd:
        for line in commit_msg:
            commit_fd.write(line)

        if errors:
            if commit_msg[-1] != "\n":
                commit_fd.write('\n')
            commit_fd.write('%s\n#! %s\n' % ('#! GIT COMMIT MESSAGE FORMAT ERRORS:', help_address))
            for error in errors:
                commit_fd.write('#! %s\n' % (error,))

    if errors:
        re_edit = raw_input('Invalid git commit message format.  Press y to edit and n to cancel the commit. [Y/n]: ')
        if re_edit.lower() in ('n','no'):
            sys.exit(1)
        call('%s %s' % (editor, message_file), shell=True)
        continue
    break