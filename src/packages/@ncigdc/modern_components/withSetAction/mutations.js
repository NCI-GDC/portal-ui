import { graphql } from 'react-relay';

export default {
  repository: {
    case: {
      append: graphql`
        mutation mutationsAppendRepositoryCaseSetMutation(
          $input: AppendSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            append {
              repository {
                case(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      remove_from: graphql`
        mutation mutationsRemoveFromRepositoryCaseSetMutation(
          $input: RemoveFromSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            remove_from {
              repository {
                case(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      create: graphql`
        mutation mutationsCreateRepositoryCaseSetMutation(
          $input: CreateSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            create {
              repository {
                case(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
    },
  },
  explore: {
    case: {
      append: graphql`
        mutation mutationsAppendExploreCaseSetMutation(
          $input: AppendSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            append {
              explore {
                case(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      remove_from: graphql`
        mutation mutationsRemoveFromExploreCaseSetMutation(
          $input: RemoveFromSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            remove_from {
              explore {
                case(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      create: graphql`
        mutation mutationsCreateExploreCaseSetMutation(
          $input: CreateSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            create {
              explore {
                case(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
    },
    ssm: {
      append: graphql`
        mutation mutationsAppendExploreSsmSetMutation(
          $input: AppendSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            append {
              explore {
                ssm(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      remove_from: graphql`
        mutation mutationsRemoveFromExploreSsmSetMutation(
          $input: RemoveFromSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            remove_from {
              explore {
                ssm(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      create: graphql`
        mutation mutationsCreateExploreSsmSetMutation(
          $input: CreateSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            create {
              explore {
                ssm(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
    },
    gene: {
      append: graphql`
        mutation mutationsAppendExploreGeneSetMutation(
          $input: AppendSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            append {
              explore {
                gene(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      remove_from: graphql`
        mutation mutationsRemoveFromExploreGeneSetMutation(
          $input: RemoveFromSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            remove_from {
              explore {
                gene(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
      create: graphql`
        mutation mutationsCreateExploreGeneSetMutation(
          $input: CreateSetInput
          $never_used: RelayIsDumb
        ) {
          sets(input: $never_used) {
            create {
              explore {
                gene(input: $input) {
                  set_id
                }
              }
            }
          }
        }
      `,
    },
  },
};
