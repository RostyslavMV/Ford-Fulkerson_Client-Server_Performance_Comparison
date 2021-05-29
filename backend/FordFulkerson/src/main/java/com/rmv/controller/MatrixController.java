package com.rmv.controller;

import com.rmv.service.MatrixService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("matrix")
@RequiredArgsConstructor
public class MatrixController {
    private final MatrixService matrixService;

    @GetMapping()
    public int[][] getMatrix(@RequestParam(value = "size", defaultValue = "10") int matrixSize) {
        return matrixService.generateMatrix(matrixSize);
    }
}
