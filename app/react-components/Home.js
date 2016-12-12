import React from 'react';
import _ from 'lodash';

const Row = ({ children, style, className }) =>
  <div className={className} style={{ display: 'flex', ...style }}>{children}</div>;

const Column = ({ children, style, className }) =>
  <div className={className} style={{ display: 'flex', flexDirection: 'column', ...style }}>{children}</div>;

const materializeShadow = { boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)' };

const center = {
  alignItems: 'center',
  justifyContent: 'center',
};

const styles = {
  container: {
    background:
      'radial-gradient(ellipse at center, rgba(147,206,222,1) 0%, rgba(117,189,209,1) 48%, rgba(73,129,189,1) 100%)',
  },
  insideContainer: {
    flex: 1,
    padding: '3rem',
    height: '50rem',
    position: 'relative',
  },
  subTitle: {
    color: 'white',
  },
  title: {
    color: 'white',
    fontSize: '3rem',
  },
  bigButton: {
    textDecoration: 'none',
    display: 'inline-block',
    width: '22.75rem',
    padding: '0.5rem 0.5rem',
    textAlign: 'left',
    fontSize: '2rem',
    margin: '0rem 0rem',
    marginTop: '1rem',
    height: '5.6rem',
    color: 'white',
    borderRadius: '6px',
  },
  bigButtonIcon: {
    display: 'inline-block',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: '0.5rem',
    padding: '1rem 1.5rem',
    fontSize: '2.4rem',
  },
  smallButton: {
    textDecoration: 'none',
    padding: '0.2rem 0.5rem',
    textAlign: 'center',
    backgroundColor: '#30b3cb',
    cursor: 'pointer',
    backgroundImage: 'none',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    lineHeight: 1.4,
    borderRadius: '4px',
    color: 'white',
    width: '10rem',
    display: 'inline-block',
    marginLeft: '1.3rem',
  },
  summaryBoxContainer: {
    ...materializeShadow,
    marginTop: '2rem',
    backgroundColor: 'white',
    borderTop: '3px solid rgb(37, 208, 182)',
  },
  dataCountBox: {
    padding: '1.5rem',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataCountBoxTitle: {
    justifyContent: 'center',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  gdcAppsRow: {
    margin: '2rem 0',
    justifyContent: 'space-around',
    width: '100vw',
    padding: '0 14rem',
  },
  gdcAppsLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
  },
};

const Home = ({ $scope }) => (
  <Column>
    <Row style={styles.container}>
      <div style={styles.insideContainer}>
        <div style={{ ...styles.subTitle, fontSize: '2rem' }}>Harmonized Cancer Datasets</div>
        <div style={styles.title}>Genomic Data Commons Data Portal</div>
        <div style={{ ...styles.subTitle, marginTop: '1rem' }}><em>Get Started by Exploring:</em></div>
        <Row>
          <a
            style={{ ...styles.bigButton, backgroundColor: '#01b987' }}
            tabIndex="0"
            href="/projects/t"
          >
            <i style={styles.bigButtonIcon} className="icon-gdc-projects" />
            &nbsp; <span data-translate>Projects</span>
          </a>
          <a
            style={{ ...styles.bigButton, backgroundColor: '#30b3cb', marginLeft: '4rem' }}
            tabIndex="0"
            href="/search/s?facetTab=cases"
          >
            <i style={styles.bigButtonIcon} className="icon-gdc-data" />
            &nbsp; <span data-translate>Data</span>
          </a>
        </Row>
        <div style={{ ...styles.subTitle, marginTop: '1rem' }}>
          <em>Perform Advanced Search Queries, such as:</em>
        </div>
        {$scope.exampleSearchQueries.map(x =>
          <Row style={{ margin: '1rem 0', alignItems: 'center' }} key={x.description}>
            <div style={{ color: 'white' }}>
              {x.description}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <a style={styles.smallButton} href={`/search/c?filters=${JSON.stringify(x.filters)}`}>
                {!x.caseCount && <span className="fa fa-spinner fa-spin" />}
                {!!x.fileCount && `${x.caseCount.toLocaleString()} Cases`}
              </a>
              <a style={styles.smallButton} href={`/search/f?filters=${JSON.stringify(x.filters)}`}>
                {!x.fileCount && <span className="fa fa-spinner fa-spin" />}
                {!!x.fileCount && `${x.fileCount.toLocaleString()} Files`}
              </a>
            </div>
          </Row>
        )}

        <Column style={styles.summaryBoxContainer}>
          <Row style={{ padding: '2rem', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2.3rem', color: 'rgb(70, 70, 70)' }}>Data Portal Summary</div>
            <div style={{ fontSize: '1.3rem', color: 'rgb(37, 97, 122)', marginLeft: '2rem' }}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://gdc-docs.nci.nih.gov/Data_Portal/Release_Notes/Data_Portal_Release_Notes/"
              >
                Data Release 3.0 - September 21, 2016
              </a>
            </div>
          </Row>
          <Row>
            <Column style={styles.dataCountBox}>
              <Row style={styles.dataCountBoxTitle}>Projects</Row>
              <Row>
                <i style={{ color: '#01b987', fontSize: '3rem' }} className="icon-gdc-projects project-icon" />
                <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
                  {($scope.projectData || { pagination: { total: 0 } }).pagination.total > 0
                    ? ($scope.projectData || { pagination: { total: 0 } }).pagination.total.toLocaleString()
                    : <span className="fa fa-spinner fa-spin" />
                  }
                </span>
              </Row>
            </Column>
            <Column style={styles.dataCountBox}>
              <Row style={{ textTransform: 'uppercase' }}>Primary Sites</Row>
              <Row>
                <i style={{ color: '#01b987', fontSize: '3rem' }} className="icon-gdc-cases data-icon" />
                <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
                  {($scope.projectData || {
                    aggregations: { primary_site: { buckets: [] } },
                  }).aggregations.primary_site.buckets.length > 0
                    ? ($scope.projectData || {
                      aggregations: { primary_site: { buckets: [] } },
                    }).aggregations.primary_site.buckets.length.toLocaleString()
                    : <span className="fa fa-spinner fa-spin" />
                  }
                </span>
              </Row>
            </Column>
            <Column style={styles.dataCountBox}>
              <Row style={{ textTransform: 'uppercase' }}>Cases</Row>
              <Row>
                <i style={{ color: '#01b987', fontSize: '3rem' }} className="icon-gdc-cases data-icon" />
                <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
                  {($scope.caseData || { pagination: { total: 0 } }).pagination.total > 0
                    ? ($scope.caseData || { pagination: { total: 0 } }).pagination.total.toLocaleString()
                    : <span className="fa fa-spinner fa-spin" />
                  }
                </span>
              </Row>
            </Column>
            <Column style={styles.dataCountBox}>
              <Row style={{ textTransform: 'uppercase' }}>Files</Row>
              <Row>
                <i style={{ color: '#01b987', fontSize: '3rem' }} className="fa fa-file-o data-icon" />
                <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
                  {($scope.fileData || { pagination: { total: 0 } }).pagination.total > 0
                    ? ($scope.fileData || { pagination: { total: 0 } }).pagination.total.toLocaleString()
                    : <span className="fa fa-spinner fa-spin" />
                  }
                </span>
              </Row>
            </Column>
          </Row>
        </Column>
      </div>
      {$scope.loadingHumanBody &&
        <Column style={{ ...styles.insideContainer, ...center }}>
          <Row style={{ color: 'white', fontSize: '1.2em', marginBottom: '1rem' }}>
            Loading, please wait...
          </Row>
          <span style={{ color: 'white' }} className="fa fa-spinner fa-spin fa-2x" />
        </Column>
      }
      {!$scope.loadingHumanBody &&
        <div id="human-body-root" style={styles.insideContainer} />
      }
    </Row>
    <Column style={{ paddingTop: '7rem', alignItems: 'center' }}>
      <Row style={{ fontSize: '1.3em' }}>GDC Applications</Row>
      <Row style={{ textAlign: 'center' }}>
        The GDC Data Portal is a robust data-driven platform that allows cancer<br />
        researchers and bioinformaticians to search and download cancer data for
        analysis. The GDC applications include:
      </Row>
      <Row style={styles.gdcAppsRow}>
        <span
          title="Data Portal"
          style={styles.gdcAppsLink}
        >
          <img
            width="35px"
            src="images/GDC-App-data-portal-blue.svg"
            className="icon icon-gdc-cbio-portal home"
            alt="GDC Data Portal"
          />
          <p>Data Portal</p>
        </span>
        <a
          href="https://gdc.nci.nih.gov/"
          target="_blank"
          rel="noopener noreferrer"
          title="GDC Website"
          style={styles.gdcAppsLink}
        >
          <img
            width="35px"
            src="images/GDC-App-website-blue.svg"
            className="icon icon-gdc-cbio-portal home"
            alt="GDC Website"
          />
          <p>Website</p>
        </a>
        <a
          href="https://gdc.nci.nih.gov/access-data/gdc-data-transfer-tool"
          target="_blank"
          rel="noopener noreferrer"
          title="GDC Data Transfer Tool"
          style={styles.gdcAppsLink}
        >
          <span
            className="icon icon-gdc-data-transer-tool"
            style={{ fontSize: '29px', marginBottom: '5px' }}
          >
            {_.range(0, 9).map(x => <span key={x} className={`path${x}`} />)}
          </span>
          <p>Data Transfer Tool</p>
        </a>
        <a
          href="https://gdc.nci.nih.gov/developers/gdc-application-programming-interface-api"
          target="_blank"
          rel="noopener noreferrer"
          title="GDC API"
          style={styles.gdcAppsLink}
        >
          <span
            className="icon icon-gdc-portal-api"
            style={{ fontSize: '29px', marginBottom: '5px' }}
          >
            {_.range(0, 11).map(x =>
              <span key={x} className={`path${x}`} />
            )}
          </span>
          <p>API</p>
        </a>
        <a
          href="https://gdc-portal.nci.nih.gov/submission/"
          target="_blank"
          rel="noopener noreferrer"
          title="GDC Submission Portal"
          style={styles.gdcAppsLink}
        >
          <span
            className="icon icon-gdc-submission-portal"
            style={{ fontSize: '29px', marginBottom: '5px' }}
          >
            {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
          </span>
          <p>Data Submission Portal</p>
        </a>
        <a
          href="https://gdc-docs.nci.nih.gov/"
          target="_blank"
          rel="noopener noreferrer"
          title="GDC Docs"
          style={styles.gdcAppsLink}
        >
          <span
            className="icon icon-gdc-docs"
            style={{ fontSize: '29px', marginBottom: '5px' }}
          >
            {_.range(0, 15).map(x => <span key={x} className={`path${x}`} />)}
          </span>
          <p>Documentation</p>
        </a>
        <a
          href="https://gdc-portal.nci.nih.gov/legacy-archive"
          target="_blank"
          rel="noopener noreferrer"
          title="GDC Legacy Archive"
          style={styles.gdcAppsLink}
        >
          <span
            className="icon icon-gdc-legacy-archive"
            style={{ fontSize: '29px', marginBottom: '5px' }}
          >
            {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
          </span>
          <p>Legacy Archive</p>
        </a>
        <a
          href="https://gdc-cbioportal.nci.nih.gov/"
          title="GDC cBio Portal"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
          style={styles.gdcAppsLink}
        >
          <img
            width="35px"
            src="images/icon-cBioPortal.svg"
            className="icon icon-gdc-cbio-portal home"
            alt="GDC cBio Portal"
          />
          <p>GDC cBio Portal</p>
        </a>
      </Row>
    </Column>
  </Column>
);

export default Home;
