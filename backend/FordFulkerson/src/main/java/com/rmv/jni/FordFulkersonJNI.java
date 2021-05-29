package com.rmv.jni;

import org.springframework.stereotype.Service;

@Service
public class FordFulkersonJNI {
  static {
    System.loadLibrary("native");
  }

  public native int fordFulkerson(int[][] graph, int s, int t);
}
