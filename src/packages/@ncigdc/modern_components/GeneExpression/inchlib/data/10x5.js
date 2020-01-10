const data = {
  "column_metadata": {
      "features": [
          [
              "female", 
              "female", 
              "female", 
              "male", 
              "female"
          ], 
          [
              "native_hawaiian_or_other_pacific_islander", 
              "not_reported", 
              "not_reported", 
              "american_indian_or_alaska_native", 
              "white"
          ], 
          [
              "hispanic_or_latino", 
              "hispanic_or_latino", 
              "not_hispanic_or_latino", 
              "not_reported", 
              "not_reported"
          ], 
          [
              "70", 
              "70", 
              "70", 
              "70", 
              "65"
          ], 
          [
              "dead", 
              "dead", 
              "dead", 
              "alive", 
              "dead"
          ], 
          [
              "1500", 
              "3000", 
              "1000", 
              "1000", 
              "2000"
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
              "ENSG00000163539", 
              "CLASP2"
          ], 
          "1": [
              "ENSG00000170275", 
              "CRTAP"
          ], 
          "2": [
              "ENSG00000153560", 
              "UBP1"
          ], 
          "3": [
              "ENSG00000173705", 
              "SUSD5"
          ], 
          "4": [
              "ENSG00000188167", 
              "TMPPE"
          ], 
          "5": [
              "ENSG00000170266", 
              "GLB1"
          ], 
          "6": [
              "ENSG00000153558", 
              "FBXL2"
          ], 
          "7": [
              "ENSG00000206557", 
              "TRIM71"
          ], 
          "8": [
              "ENSG00000153560", 
              "UBP1"
          ], 
          "9": [
              "ENSG00000162510", 
              "MATN1"
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
                  1.630903247, 
                  0.756931363, 
                  1.520964521, 
                  3.756673529, 
                  0.87335077
              ], 
              "parent": 14
          }, 
          "1": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "2"
              ], 
              "features": [
                  3.791245628, 
                  3.901656775, 
                  1.922797235, 
                  3.506343323, 
                  1.511470976
              ], 
              "parent": 15
          }, 
          "2": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "3"
              ], 
              "features": [
                  6.24237503, 
                  6.603843283, 
                  6.752444135, 
                  6.232230099, 
                  5.731165098
              ], 
              "parent": 10
          }, 
          "3": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "4"
              ], 
              "features": [
                  4.314367357, 
                  4.246900529, 
                  4.246957042, 
                  4.316788857, 
                  3.454459512
              ], 
              "parent": 12
          }, 
          "4": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "5"
              ], 
              "features": [
                  6.61969068, 
                  6.519565266, 
                  6.199710451, 
                  7.174262606, 
                  7.666878596
              ], 
              "parent": 11
          }, 
          "5": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "6"
              ], 
              "features": [
                  3.290051877, 
                  1.406435381, 
                  2.315182899, 
                  2.328373308, 
                  4.310545394
              ], 
              "parent": 15
          }, 
          "6": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "7"
              ], 
              "features": [
                  4.185199899, 
                  3.751393093, 
                  4.655490821, 
                  4.742380331, 
                  4.126962277
              ], 
              "parent": 12
          }, 
          "7": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "8"
              ], 
              "features": [
                  6.283817206, 
                  6.230066057, 
                  6.150283333, 
                  6.332635401, 
                  6.103919076
              ], 
              "parent": 10
          }, 
          "8": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "9"
              ], 
              "features": [
                  6.577745875, 
                  6.490210048, 
                  6.412696068, 
                  6.983515911, 
                  6.742395297
              ], 
              "parent": 11
          }, 
          "9": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "10"
              ], 
              "features": [
                  0.522948869, 
                  0.578001818, 
                  0.211652291, 
                  0.333735282, 
                  0.64297053
              ], 
              "parent": 14
          }, 
          "10": {
              "count": 2, 
              "distance": 0.808, 
              "left_child": 2, 
              "parent": 13, 
              "right_child": 7
          }, 
          "11": {
              "count": 2, 
              "distance": 0.969, 
              "left_child": 4, 
              "parent": 13, 
              "right_child": 8
          }, 
          "12": {
              "count": 2, 
              "distance": 1.031, 
              "left_child": 3, 
              "parent": 16, 
              "right_child": 6
          }, 
          "13": {
              "count": 4, 
              "distance": 2.206, 
              "left_child": 10, 
              "parent": 18, 
              "right_child": 11
          }, 
          "14": {
              "count": 2, 
              "distance": 3.84, 
              "left_child": 0, 
              "parent": 17, 
              "right_child": 9
          }, 
          "15": {
              "count": 2, 
              "distance": 3.982, 
              "left_child": 1, 
              "parent": 16, 
              "right_child": 5
          }, 
          "16": {
              "count": 4, 
              "distance": 4.717, 
              "left_child": 12, 
              "parent": 17, 
              "right_child": 15
          }, 
          "17": {
              "count": 6, 
              "distance": 9.004, 
              "left_child": 14, 
              "parent": 18, 
              "right_child": 16
          }, 
          "18": {
              "count": 10, 
              "distance": 18.644, 
              "left_child": 13, 
              "right_child": 17
          }
      }, 
      "feature_names": [
          "TCGA-2W-A8YY_5aeac31a-176a-4f93-a376-a93a670821bb", 
          "TCGA-E6-A1LX_435b57e7-5cd4-486a-b3d4-ccb1ef160d52", 
          "TCGA-B5-A3FC_ec2040a3-788b-4f2c-a093-c5c4b3dc4b6c", 
          "TCGA-EO-A22U_30bc72d5-07b5-48d2-b025-bba9bcf2f09f", 
          "TCGA-EO-A22R_508bf716-46f9-44dc-8e39-09261dfb073e"
      ]
  }, 
  "column_dendrogram": {
      "nodes": {
          "0": {
              "count": 1, 
              "distance": 0, 
              "parent": 7
          }, 
          "1": {
              "count": 1, 
              "distance": 0, 
              "parent": 6
          }, 
          "2": {
              "count": 1, 
              "distance": 0, 
              "parent": 5
          }, 
          "3": {
              "count": 1, 
              "distance": 0, 
              "parent": 8
          }, 
          "4": {
              "count": 1, 
              "distance": 0, 
              "parent": 5
          }, 
          "5": {
              "count": 2, 
              "distance": 2.161, 
              "left_child": 2, 
              "parent": 6, 
              "right_child": 4
          }, 
          "6": {
              "count": 3, 
              "distance": 2.495, 
              "left_child": 1, 
              "parent": 7, 
              "right_child": 5
          }, 
          "7": {
              "count": 4, 
              "distance": 3.308, 
              "left_child": 0, 
              "parent": 8, 
              "right_child": 6
          }, 
          "8": {
              "count": 5, 
              "distance": 4.107, 
              "left_child": 3, 
              "right_child": 7
          }
      }
  }
};

export default data;