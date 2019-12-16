const data = {
  "column_metadata": {
      "features": [
          [
              "female", 
              "female", 
              "female"
          ], 
          [
              "not_reported", 
              "black_or_african_american", 
              "black_or_african_american"
          ], 
          [
              "hispanic_or_latino", 
              "not_hispanic_or_latino", 
              "hispanic_or_latino"
          ], 
          [
              "70", 
              "60", 
              "70"
          ], 
          [
              "alive", 
              "alive", 
              "alive"
          ], 
          [
              "0", 
              "1500", 
              "500"
          ]
      ], 
      "feature_names": [
          "Gender", 
          "Race", 
          "Ethnicity", 
          "Age at Diagnosis", 
          "Vital Status", 
          "Days to Death"
      ]
  }, 
  "metadata": {
      "nodes": {
          "0": [
              "ENSG00000183813", 
              "CCR4"
          ], 
          "1": [
              "ENSG00000153558", 
              "FBXL2"
          ]
      }, 
      "feature_names": [
          "gene_ensembl", 
          "gene_symbol"
      ]
  }, 
  "data": {
      "nodes": {
          "0": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "1"
              ], 
              "features": [
                  0.756931363, 
                  1.520964521, 
                  3.756673529
              ], 
              "parent": 2
          }, 
          "1": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "2"
              ], 
              "features": [
                  3.901656775, 
                  1.922797235, 
                  3.506343323
              ], 
              "parent": 2
          }, 
          "2": {
              "count": 2, 
              "distance": 3.18, 
              "left_child": 0, 
              "right_child": 1
          }
      }, 
      "feature_names": [
          "TCGA-IB-7651_3559f697-8fec-4f36-962c-632272fe9c9c", 
          "TCGA-AX-A1CE_4db38349-28d2-4af5-a12f-3d861937b0e0", 
          "TCGA-2W-A8YY_5aeac31a-176a-4f93-a376-a93a670821bb"
      ]
  }, 
  "column_dendrogram": {
      "nodes": {
          "0": {
              "count": 1, 
              "distance": 0, 
              "parent": 4
          }, 
          "1": {
              "count": 1, 
              "distance": 0, 
              "parent": 3
          }, 
          "2": {
              "count": 1, 
              "distance": 0, 
              "parent": 3
          }, 
          "3": {
              "count": 2, 
              "distance": 2.121, 
              "left_child": 1, 
              "parent": 4, 
              "right_child": 2
          }, 
          "4": {
              "count": 3, 
              "distance": 3.1, 
              "left_child": 0, 
              "right_child": 3
          }
      }
  }
};

export default data;