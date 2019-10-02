import React from 'react';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import { Row } from '@ncigdc/uikit/Flex';

const survivalData = {
  rawData: {
    overallStats: {},
    results: [
      {
        donors: [
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.06297056810403832,
            survivalEstimate: 1,
            submitter_id: 'TCGA-24-1422',
            id: '05ba5839-e00a-4a9e-8ba3-ecb490781e62',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.06570841889117043,
            survivalEstimate: 0.9705882352941176,
            submitter_id: 'TCGA-VG-A8LO',
            id: '8628f1b2-3763-4ba9-a375-083874bb18f2',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.15058179329226556,
            survivalEstimate: 0.9411764705882353,
            submitter_id: 'TCGA-04-1335',
            id: 'ab3dbbbe-eed6-4a35-a505-1815225e86c9',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.2299794661190965,
            survivalEstimate: 0.9117647058823529,
            submitter_id: 'TCGA-23-1032',
            id: 'd1976840-35f7-4423-8458-12fb32a52b33',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 0.48186173853524983,
            survivalEstimate: 0.8823529411764706,
            submitter_id: 'TCGA-61-1900',
            id: 'ef653772-e5d2-46ec-8610-f81d75d7353c',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 0.6351813826146475,
            survivalEstimate: 0.8823529411764706,
            submitter_id: 'TCGA-24-0966',
            id: 'fef1696c-a8f4-4db6-8615-e486522baaaa',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.7008898015058179,
            survivalEstimate: 0.8823529411764706,
            submitter_id: 'TCGA-13-A5FU',
            id: '0f7ac6ca-7806-4b2a-9d37-94ff74fcd010',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.8323066392881588,
            survivalEstimate: 0.8508403361344538,
            submitter_id: 'TCGA-WR-A838',
            id: 'b8023162-5e82-40e6-ad8c-8acf81821f01',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 0.947296372347707,
            survivalEstimate: 0.819327731092437,
            submitter_id: 'TCGA-57-1583',
            id: '76cc2d21-eebc-4f09-9bc7-dbf7af0aafa8',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 0.9856262833675564,
            survivalEstimate: 0.7878151260504201,
            submitter_id: 'TCGA-29-1776',
            id: '7472b3ba-9b15-4d97-8708-a2dd82ca0f45',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 0.9883641341546886,
            survivalEstimate: 0.7878151260504201,
            submitter_id: 'TCGA-5X-AA5U',
            id: 'bc84c5c5-1785-4edd-b732-8987f862063e',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 1.1498973305954825,
            survivalEstimate: 0.7878151260504201,
            submitter_id: 'TCGA-3P-A9WA',
            id: 'e35b2813-427e-4e83-95f6-4f0281f42a59',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 1.5770020533880904,
            survivalEstimate: 0.7878151260504201,
            submitter_id: 'TCGA-OY-A56Q',
            id: 'c7cf6755-8856-435b-a443-174b22a25b07',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 1.7084188911704312,
            survivalEstimate: 0.7878151260504201,
            submitter_id: 'TCGA-59-A5PD',
            id: '7ebc776e-bde1-4563-adb1-8bd441872733',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 1.7440109514031485,
            survivalEstimate: 0.7503001200480192,
            submitter_id: 'TCGA-09-2054',
            id: 'cbd87697-7708-4b69-9e50-9ee474feabe1',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 1.8507871321013005,
            survivalEstimate: 0.7127851140456182,
            submitter_id: 'TCGA-24-1474',
            id: 'd7b3156d-672a-4a55-868d-9ca6a09fcb0f',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 2.245037645448323,
            survivalEstimate: 0.6752701080432172,
            submitter_id: 'TCGA-24-1544',
            id: '21f6bf91-dfc6-4a59-8b76-88a0f95c7b47',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 2.42299794661191,
            survivalEstimate: 0.6377551020408162,
            submitter_id: 'TCGA-04-1536',
            id: '1fe19c6b-71d0-4b07-923b-74ea32210db0',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 2.8829568788501025,
            survivalEstimate: 0.6002400960384152,
            submitter_id: 'TCGA-29-1711',
            id: 'f58e49fc-9641-4b46-be4c-766445ec70a3',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 2.9787816563997263,
            survivalEstimate: 0.6002400960384152,
            submitter_id: 'TCGA-29-A5NZ',
            id: 'f1cb3d48-1415-408d-89d1-dfdcc5924963',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 2.9815195071868583,
            survivalEstimate: 0.5602240896358542,
            submitter_id: 'TCGA-61-1738',
            id: '72c40fba-f502-489b-ad87-843f52655894',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 3.07460643394935,
            survivalEstimate: 0.5202080832332933,
            submitter_id: 'TCGA-10-0936',
            id: '7016714b-6af8-45dd-8341-1493927e5515',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 3.3045859000684463,
            survivalEstimate: 0.4801920768307323,
            submitter_id: 'TCGA-OY-A56P',
            id: '260723bf-9620-450d-bf31-f3a45543f9db',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 3.6112251882272415,
            survivalEstimate: 0.4801920768307323,
            submitter_id: 'TCGA-13-0893',
            id: '15170c7f-5880-4fb6-82ce-68d3df0dfb68',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 3.8302532511978096,
            survivalEstimate: 0.43653825166430205,
            submitter_id: 'TCGA-13-0801',
            id: 'b8c3d99c-429b-42a3-b486-6fbcb90cc2e0',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 3.972621492128679,
            survivalEstimate: 0.39288442649787186,
            submitter_id: 'TCGA-24-1563',
            id: '52386f66-2877-4c75-894e-5c1dc03e6ef4',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 4.506502395619439,
            survivalEstimate: 0.3492306013314416,
            submitter_id: 'TCGA-24-1103',
            id: 'f34aa3b6-e966-49c6-bc55-130545772c53',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 4.616016427104722,
            survivalEstimate: 0.30557677616501144,
            submitter_id: 'TCGA-04-1638',
            id: 'c75c915f-ef4b-4c19-8ace-995e6c6015fd',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 4.843258042436688,
            survivalEstimate: 0.2619229509985812,
            submitter_id: 'TCGA-24-2024',
            id: '0a48873a-092a-4b25-822b-b0b3c18c08a8',
          },
          {
            project_id: 'TCGA-OV',
            censored: false,
            time: 4.969199178644764,
            survivalEstimate: 0.21826912583215102,
            submitter_id: 'TCGA-29-1703',
            id: 'b3511675-fd68-4745-8020-e290ca0fd115',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 5.456536618754278,
            survivalEstimate: 0.17461530066572084,
            submitter_id: 'TCGA-13-2065',
            id: '8d1dcf21-efd3-4fbe-ad44-f43a19239383',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 5.563312799452429,
            survivalEstimate: 0.17461530066572084,
            submitter_id: 'TCGA-29-1763',
            id: '242da7d0-8c6a-4395-9a0d-aa36e7c25ce6',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 5.689253935660506,
            survivalEstimate: 0.17461530066572084,
            submitter_id: 'TCGA-29-1698',
            id: '18d21132-a795-4551-83ba-66483de423a2',
          },
          {
            project_id: 'TCGA-OV',
            censored: true,
            time: 5.867214236824093,
            survivalEstimate: 0.17461530066572084,
            submitter_id: 'TCGA-13-A5FT',
            id: 'f3618472-32dc-4c90-a407-90050f68be85',
          },
        ],
        meta: { id: 139765957926568 },
      },
    ],
  },
  id: 'Clinical Analysis',
  legend: [
    {
      key: 'Clinical Analysis',
      value: 'Where you need to change the legend',
    },
  ],
};

const SurvivalAnalysisCard = ({ overallSurvivalData }) => (
  <Row>
    <div
      style={{
        width: '50%',
        padding: '10px',
      }}
      >
      <SurvivalPlotWrapper
        {...survivalData}
        enableButton={false}
        height={250}
        plotType="clinicalOverall"
        />
    </div>
  </Row>
);
export default SurvivalAnalysisCard;
