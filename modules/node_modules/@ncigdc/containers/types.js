/* @flow */

export type TTableProps = {
  hits: {
    edges: Array<{|
      node: {|
       id: string,
     |},
   |}>,
    pagination: {
      offset: number,
      size: number,
      sort: string,
      total: number,
    },
  },
};
