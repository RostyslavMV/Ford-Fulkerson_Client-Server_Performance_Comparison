package com.rmv.controller;

import com.rmv.dto.response.TimeFlowResponse;
import com.rmv.service.FordFulkersonTimeFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("time")
@RequiredArgsConstructor
public class FordFulkersonTimeController {
    private final FordFulkersonTimeFlowService fordFulkersonTimeFlowService;

    @GetMapping("/java")
    public TimeFlowResponse getJavaTimeFlow() {
        return fordFulkersonTimeFlowService.getJavaTimeFlow();
    }

    @GetMapping("/jni")
    public  TimeFlowResponse getJniTimeFlow() {
        return fordFulkersonTimeFlowService.getJniTimeFlow();
    }
}
