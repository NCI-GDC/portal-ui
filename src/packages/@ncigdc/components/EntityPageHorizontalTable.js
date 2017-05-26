/* global d3 */

// @flow

import React from "react";
import * as d3 from "d3";
import { Row, Column } from "@ncigdc/uikit/Flex";
import Table, { Tr, Td, Th } from "@ncigdc/uikit/Table";
import { withTheme } from "@ncigdc/theme";

const colors = d3.scaleOrdinal(d3.schemeCategory20);

const styles = {
  table: {
    borderCollapse: "collapse",
    borderSpacing: 0,
    overflow: "auto",
    backgroundColor: "#fff"
  },
  tr: {
    border: "none !important"
  },
  td: {
    border: "none !important"
  }
};

// th are horizontal
const EntityPageHorizontalTable = ({
  style,
  title,
  titleStyle,
  rightComponent,
  headings,
  data,
  emptyMessage,
  theme,
  tableId
}) => (
  <Column
    style={{
      flexWrap: "wrap",
      overflow: "auto",
      ...style
    }}
  >
    {title &&
      <h3
        style={{
          color: theme.greyScale7,
          width: "100%",
          fontSize: "24px",
          lineHeight: "1.4em",
          fontWeight: "normal",
          marginTop: 0,
          marginBottom: 0,
          padding: "1rem",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          ...titleStyle
        }}
      >
        {title} {rightComponent}
      </h3>}
    {!!data.length &&
      <Table
        id={tableId}
        style={styles.table}
        headings={headings.map(h => (
          <Th
            rowSpan={h.subheadings ? 1 : 2}
            colSpan={h.subheadings ? h.subheadings.length : 1}
            key={h.key}
            style={h.thStyle || h.style || {}}
          >
            {h.title}
          </Th>
        ))}
        subheadings={headings.map(
          h =>
            h.subheadings &&
            h.subheadings.map((s, i) => <Th key={`subheading-${i}`}>{s}</Th>)
        )}
        body={
          <tbody>
            {data.map((d, i) => (
              <Tr
                style={{
                  ...styles.tr,
                  backgroundColor: i % 2 === 0 ? theme.tableStripe : "#fff"
                }}
                key={i}
              >
                {headings.map(h =>
                  [].concat(d[h.key]).map((v, j) => (
                    <Td
                      key={`${h.key}-${j}`}
                      style={h.tdStyle || h.style || {}}
                      className={h.className || ""}
                    >
                      {h.color &&
                        <div
                          className="h-color"
                          style={{ backgroundColor: colors(i) }}
                        />}
                      {v || "--"}
                    </Td>
                  ))
                )}
              </Tr>
            ))}
          </tbody>
        }
      />}
    {!data.length &&
      <Row
        style={{
          borderBottom: `1px solid ${theme.greyScale5}`
        }}
      >
        {emptyMessage && <h4 style={{ padding: "1rem" }}>{emptyMessage}</h4>}
      </Row>}
  </Column>
);

export default withTheme(EntityPageHorizontalTable);
