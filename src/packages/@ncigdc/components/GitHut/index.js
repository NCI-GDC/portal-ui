/* @flow */

import React from 'react';
import JSURL from 'jsurl';
import draw from './draw';
import { debounce } from 'lodash';

import { compose } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';

import { fetchApi } from '@ncigdc/utils/ajax/index';

import './style.css';
import { parseFilterParam } from '../../utils/uri/index';
import getColumns from './columns';
import prepareData from './prepareData';

// TODO: require d3-tip instead. Currently appends d3-tip for githut. Appending here to avoid issues in load order.
const d3TipUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js';
const existingScript = document.querySelector(`script[src="${d3TipUrl}"]`);
if (!existingScript) {
  const script = document.createElement('script');
  script.src = d3TipUrl;
  document.body && document.body.appendChild(script);
}

const FIELDS = [
  'disease_type',
  'state',
  'primary_site',
  'project_id',
  'name',
  'program.name',
  'summary.case_count',
  'summary.file_count',
  'summary.file_size',
  'summary.data_categories.data_category',
  'summary.data_categories.case_count',
].join(',');

class GitHutWrapper extends React.Component {
  container = null;
  data = null;

  onResize = debounce(() => this.drawGraph(), 150);

  drawGraph() {
    const columns = getColumns({
      onProjectClick: ({ projectId }) =>
        this.props.push({ pathname: `projects/${projectId}` }),
      onCaseCountClick: ({ projectId }) => {
        this.props.push({
          pathname: '/repository',
          query: {
            filters: JSURL.stringify({
              op: 'AND',
              content: [
                {
                  op: 'IN',
                  content: {
                    field: 'cases.project.project_id',
                    value: [projectId],
                  },
                },
              ],
            }),
          },
        });
      },
      onDataTypeClick: ({ projectId, columnId }) => {
        this.props.push({
          pathname: '/repository',
          query: {
            filters: JSURL.stringify({
              op: 'AND',
              content: [
                {
                  op: 'IN',
                  content: {
                    field: 'cases.project.project_id',
                    value: [projectId],
                  },
                },
                {
                  op: 'IN',
                  content: {
                    field: 'files.data_category',
                    value: [columnId],
                  },
                },
              ],
            }),
          },
        });
      },
      onFileCountClick: ({ projectId }) => {
        this.props.push({
          pathname: '/repository',
          query: {
            searchTableTab: 'files',
            filters: JSURL.stringify({
              op: 'AND',
              content: [
                {
                  op: 'IN',
                  content: {
                    field: 'cases.project.project_id',
                    value: [projectId],
                  },
                },
              ],
            }),
          },
        });
      },
    });
    draw({
      columns,
      container: this.container,
      data: prepareData(this.data, columns),
    });
  }
  fetchData(props) {
    const filters = parseFilterParam(props.query.filters);

    fetchApi(
      `projects?fields=${FIELDS}${filters
        ? `&filters=${JSON.stringify(filters)}`
        : ''}&size=100&sort=summary.case_count:desc`,
    ).then(data => {
      this.data = data.data.hits || [];
      this.drawGraph();
      window.addEventListener('resize', this.onResize);
    });
  }
  componentDidMount() {
    this.fetchData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.query.filters !== nextProps.query.filters) {
      this.fetchData(nextProps);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  render() {
    return (
      <div className="githut">
        <div style={{ textAlign: 'center', fontSize: 20, marginTop: 20 }}>
          Case count per Data Category
        </div>
        <div
          style={{ width: '100%' }}
          className="container"
          ref={e => (this.container = e)}
        />
      </div>
    );
  }
}
export default compose(withRouter)(GitHutWrapper);
