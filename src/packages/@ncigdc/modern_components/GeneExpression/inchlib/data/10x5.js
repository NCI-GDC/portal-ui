// created with inchlib_clust on the command line

const data = {
  "column_metadata": {
      "features": [
          [
              "male", 
              "unknown", 
              "female", 
              "unknown", 
              "female", 
              "unknown", 
              "male", 
              "female", 
              "male", 
              "unknown"
          ], 
          [
              "60", 
              "60", 
              "80", 
              "80", 
              "80", 
              "60", 
              "70", 
              "70", 
              "80", 
              "70"
          ], 
          [
              "unknown", 
              "unknown", 
              "did_not_smoke", 
              "unknown", 
              "unknown", 
              "smoked", 
              "did_not_smoke", 
              "smoked", 
              "smoked", 
              "smoked"
          ]
      ], 
      "feature_names": [
          "Gender", 
          "Age", 
          "Smoking"
      ]
  }, 
  "metadata": {
      "nodes": {
          "0": [
              "GLB1"
          ], 
          "1": [
              "TMPPE"
          ], 
          "2": [
              "CLASP2"
          ], 
          "3": [
              "FBXL2"
          ], 
          "4": [
              "CCR4"
          ]
      }, 
      "feature_names": [
          "gene_id"
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
                  0.891765966, 
                  1.520964521, 
                  0.87335077, 
                  0.912801252, 
                  0.756931363, 
                  1.630903247, 
                  0.469534344, 
                  3.024852528, 
                  3.756673529, 
                  4.214124519
              ], 
              "parent": 7
          }, 
          "1": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "2"
              ], 
              "features": [
                  0.833596105, 
                  1.922797235, 
                  1.511470976, 
                  3.293583292, 
                  3.901656775, 
                  3.791245628, 
                  3.74818425, 
                  3.042025518, 
                  3.506343323, 
                  0.728504579
              ], 
              "parent": 6
          }, 
          "2": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "3"
              ], 
              "features": [
                  6.737533679, 
                  6.752444135, 
                  5.731165098, 
                  6.381841943, 
                  6.603843283, 
                  6.24237503, 
                  6.267921376, 
                  6.766716194, 
                  6.232230099, 
                  6.471666261
              ], 
              "parent": 5
          }, 
          "3": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "4"
              ], 
              "features": [
                  4.112896548, 
                  4.246957042, 
                  3.454459512, 
                  4.0834809, 
                  4.246900529, 
                  4.314367357, 
                  3.926651073, 
                  4.586471745, 
                  4.316788857, 
                  4.680016384
              ], 
              "parent": 6
          }, 
          "4": {
              "count": 1, 
              "distance": 0, 
              "objects": [
                  "5"
              ], 
              "features": [
                  6.498741724, 
                  6.199710451, 
                  7.666878596, 
                  6.621190304, 
                  6.519565266, 
                  6.61969068, 
                  7.532756366, 
                  6.627534392, 
                  7.174262606, 
                  6.692850735
              ], 
              "parent": 5
          }, 
          "5": {
              "count": 2, 
              "distance": 2.621, 
              "left_child": 2, 
              "parent": 8, 
              "right_child": 4
          }, 
          "6": {
              "count": 2, 
              "distance": 6.296, 
              "left_child": 1, 
              "parent": 7, 
              "right_child": 3
          }, 
          "7": {
              "count": 3, 
              "distance": 7.864, 
              "left_child": 0, 
              "parent": 8, 
              "right_child": 6
          }, 
          "8": {
              "count": 5, 
              "distance": 18.567, 
              "left_child": 5, 
              "right_child": 7
          }
      }, 
      "feature_names": [
          "C3N-6339", 
          "C3N-8159", 
          "C3N-3777", 
          "C3N-7023", 
          "C3N-9135", 
          "C3N-3257", 
          "C3N-4225", 
          "C3N-9288", 
          "C3N-1363", 
          "C3N-6132"
      ]
  }, 
  "column_dendrogram": {
      "nodes": {
          "0": {
              "count": 1, 
              "distance": 0, 
              "parent": 12
          }, 
          "1": {
              "count": 1, 
              "distance": 0, 
              "parent": 13
          }, 
          "2": {
              "count": 1, 
              "distance": 0, 
              "parent": 10
          }, 
          "3": {
              "count": 1, 
              "distance": 0, 
              "parent": 15
          }, 
          "4": {
              "count": 1, 
              "distance": 0, 
              "parent": 11
          }, 
          "5": {
              "count": 1, 
              "distance": 0, 
              "parent": 16
          }, 
          "6": {
              "count": 1, 
              "distance": 0, 
              "parent": 12
          }, 
          "7": {
              "count": 1, 
              "distance": 0, 
              "parent": 10
          }, 
          "8": {
              "count": 1, 
              "distance": 0, 
              "parent": 13
          }, 
          "9": {
              "count": 1, 
              "distance": 0, 
              "parent": 14
          }, 
          "10": {
              "count": 2, 
              "distance": 0.693, 
              "left_child": 2, 
              "parent": 11, 
              "right_child": 7
          }, 
          "11": {
              "count": 3, 
              "distance": 1.006, 
              "left_child": 4, 
              "parent": 14, 
              "right_child": 10
          }, 
          "12": {
              "count": 2, 
              "distance": 1.187, 
              "left_child": 0, 
              "parent": 16, 
              "right_child": 6
          }, 
          "13": {
              "count": 2, 
              "distance": 1.3, 
              "left_child": 1, 
              "parent": 15, 
              "right_child": 8
          }, 
          "14": {
              "count": 4, 
              "distance": 1.451, 
              "left_child": 9, 
              "parent": 17, 
              "right_child": 11
          }, 
          "15": {
              "count": 3, 
              "distance": 2.135, 
              "left_child": 3, 
              "parent": 17, 
              "right_child": 13
          }, 
          "16": {
              "count": 3, 
              "distance": 3.11, 
              "left_child": 5, 
              "parent": 18, 
              "right_child": 12
          }, 
          "17": {
              "count": 7, 
              "distance": 4.214, 
              "left_child": 14, 
              "parent": 18, 
              "right_child": 15
          }, 
          "18": {
              "count": 10, 
              "distance": 5.567, 
              "left_child": 16, 
              "right_child": 17
          }
      }
  }
};

export default data;
