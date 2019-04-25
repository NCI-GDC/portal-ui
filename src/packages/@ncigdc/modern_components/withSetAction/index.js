// @flow
import { withProps, compose } from 'recompose';

import withSetAction from './withSetAction';
import SetActionButton from './SetActionButton';

export const CreateExploreGeneSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'gene',
    scope: 'explore',
    action: 'create',
  })),
)(SetActionButton);

export const CreateExploreCaseSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'case',
    scope: 'explore',
    action: 'create',
  })),
)(SetActionButton);

export const CreateExploreSsmSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'ssm',
    scope: 'explore',
    action: 'create',
  })),
)(SetActionButton);

export const CreateRepositoryCaseSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'case',
    scope: 'repository',
    action: 'create',
  })),
)(SetActionButton);

export const AppendExploreGeneSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'gene',
    scope: 'explore',
    action: 'append',
  })),
)(SetActionButton);

export const AppendExploreCaseSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'case',
    scope: 'explore',
    action: 'append',
  })),
)(SetActionButton);

export const AppendExploreSsmSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'ssm',
    scope: 'explore',
    action: 'append',
  })),
)(SetActionButton);

export const AppendRepositoryCaseSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'case',
    scope: 'repository',
    action: 'append',
  })),
)(SetActionButton);

export const RemoveFromExploreGeneSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'gene',
    scope: 'explore',
    action: 'remove_from',
  })),
)(SetActionButton);

export const RemoveFromExploreCaseSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'case',
    scope: 'explore',
    action: 'remove_from',
  })),
)(SetActionButton);

export const RemoveFromExploreSsmSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'ssm',
    scope: 'explore',
    action: 'remove_from',
  })),
)(SetActionButton);

export const RemoveFromRepositoryCaseSetButton = compose(
  withSetAction,
  withProps(() => ({
    type: 'case',
    scope: 'repository',
    action: 'remove_from',
  })),
)(SetActionButton);

export default withSetAction;
