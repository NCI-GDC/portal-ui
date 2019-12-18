/* eslint-disable camelcase */

import React, { Component } from 'react';
// import { Redirect } from 'react-router';
// import { withRouter } from 'react-router-dom';
// import GeneLink from '@ncigdc/components/Links/GeneLink';
import { Link } from 'react-router-dom';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

import { isEqual } from 'lodash';

import { theme } from '@ncigdc/theme';
import './inchlib';

const category_colors = {
  'Age at Diagnosis': 'BuGn',
  'Days to Death': 'Blues',
  Ethnicity: 'PuOr',
  Gender: 'PiYG2',
  Race: 'YlOrB',
  'Vital Status': 'RdBu',
};

const options = {
  button_color: theme.primary,
  category_colors,
  font: {
    color: '#767676',
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    size: 12,
  },
  max_width: 800,
  tooltip: {
    fill: '#fff',
    stroke: theme.greyScale5,
    text_fill: theme.greyScale2,
  },
};

class GeneExpressionChart extends Component {
  state = {
    case_uuid: '',
    gene_ensembl: '',
    toCase: false,
    toGene: false,
  }

  componentDidMount() {
    const { data } = this.props;
    this.options = {
      ...options,
      data,
    };
    // this doesn't work if jquery is imported
    // in this file
    this.$el = $(this.el);
    this.$el.InCHlib(this.options);

    this.el.addEventListener('clickGene', this.handleClickGene);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (!isEqual(data, prevProps.data)) {
      const nextOptions = {
        ...this.options,
        ...{ data },
      };
      this.$el.InCHlib(nextOptions);
    }
  }

  componentWillUnmount() {
    this.el.removeEventListener('clickGene', this.handleClickGene);
    this.$el.InCHlib('destroy');
  }

  handleClickGene = ({ detail: { gene_ensembl } }) => {
    console.log('react event', gene_ensembl);
    this.setState({
      gene_ensembl,
      toGene: true,
    });
    // this.props.history.push(`/genes/${gene_ensembl}`);
  }

  render() {
    // const {
    //   case_uuid, gene_ensembl, toCase, toGene,
    // } = this.state;

    return (
      <div>
        <ExploreLink
          query={{
            filters: {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'cases.case_id',
                    value: ['set_id:demo-pancreas'],
                  },
                },
                {
                  op: 'in',
                  content: {
                    field: 'diagnoses.primary_diagnosis',
                    value: ['duct adenocarcinoma, nos'],
                  },
                },
              ],
            },
            searchTableTab: 'cases',
          }}
          >
        EXPLORE LINK
        </ExploreLink>
        <br />
        <Link
          to={{
            pathname: '/exploration?filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.case_id%22%2C%22value%22%3A%5B%22set_id%3Ademo-pancreas%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22diagnoses.primary_diagnosis%22%2C%22value%22%3A%5B%22duct%20adenocarcinoma%2C%20nos%22%5D%7D%7D%5D%7D',
            // pathname: '/genes/ENSG00000141510',
            search: '',
          }}
          >
          REGULAR LINK
        </Link>
        <div ref={el => this.el = el} />
      </div>
    );

    // return toCase
    //   ? (
    //     <Redirect
    //       to={{
    //         pathname: `/cases/${case_uuid}`,
    //       }}
    //       />
    //     )
    //   : toGene
    //     ? (<GeneLink uuid={gene_ensembl} />)
    //       // (
    //       // <Redirect
    //       //   to={{
    //       //     // pathname: `/genes/${gene_ensembl}`,
    //       //     pathname: '/genes/ENSG00000141510',
    //       //     search: '',
    //       //   }}
    //       //   />
    //       // )
    //     : <div ref={el => this.el = el} />;

    // return (
      // <div ref={el => this.el = el} />
    // );
  }
}

export default GeneExpressionChart;
