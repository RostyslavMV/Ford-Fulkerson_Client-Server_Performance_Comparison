package com.rmv.service;

import com.rmv.dto.response.TimeFlowResponse;
import com.rmv.jni.FordFulkersonJNI;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FordFulkersonTimeFlowService {
  private final FordFulkersonMaxFlowService fordFulkersonMaxFlowService;
  private final FordFulkersonJNI fordFulkersonJNI;
  private final MatrixService matrixService;

  public TimeFlowResponse getJavaTimeFlow() {
    int[][] matrix = matrixService.getLastMatrix();
    if (matrix.length == 0) {
      return new TimeFlowResponse();
    }
    int lastNode = matrix.length - 1;
    long start = System.currentTimeMillis();
    int flow = fordFulkersonMaxFlowService.fordFulkerson(matrix, 0, lastNode);
    long finish = System.currentTimeMillis();
    return new TimeFlowResponse(flow, finish - start);
  }

  public TimeFlowResponse getJniTimeFlow() {
    int[][] matrix = matrixService.getLastMatrix();
    if (matrix.length == 0) {
      return new TimeFlowResponse();
    }
    int lastNode = matrix.length - 1;
    long start = System.currentTimeMillis();
    int flow = fordFulkersonJNI.fordFulkerson(matrix, 0, lastNode);
    long finish = System.currentTimeMillis();
    return new TimeFlowResponse(flow, finish - start);
  }
}
