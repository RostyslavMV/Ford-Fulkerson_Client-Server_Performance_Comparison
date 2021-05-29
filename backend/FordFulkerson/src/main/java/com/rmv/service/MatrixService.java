package com.rmv.service;

import com.rmv.jni.FordFulkersonJNI;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

@Service
@Getter
@RequiredArgsConstructor
public class MatrixService {
  private static final int MAX_EDGE_FLOW = 100;

  private int[][] lastMatrix;

  public void generateMatrixFile(String fileName, int size) {
    int[][] matrix = generateMatrix(size);
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        System.out.print(matrix[i][j] + " ");
      }
      System.out.println();
    }
    saveMatrixToFile(fileName, matrix);
  }

  public int[][] generateMatrix(int size) {
    int[][] matrix = new int[size][size];
    Random random = new Random();
    for (int i = 0; i < size - 1; i++) {
      for (int j = 1; j < size; j++) {
        matrix[i][j] = random.nextInt(MAX_EDGE_FLOW);
      }
      matrix[i][0] = 0;
      matrix[i][i] = 0;
      matrix[i][i + 1] = random.nextInt(MAX_EDGE_FLOW - 1) + 1;
    }

    lastMatrix = matrix;
    return matrix;
  }

  private void saveMatrixToFile(String fileName, int[][] matrix) {
    File file = new File(fileName);
    try {
      BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(fileName));
      for (int[] ints : matrix) {
        for (int j = 0; j < ints.length; j++) {
          bufferedWriter.write(ints[j] + ((j == ints.length - 1) ? "" : ", "));
        }
        bufferedWriter.newLine();
      }
      bufferedWriter.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
