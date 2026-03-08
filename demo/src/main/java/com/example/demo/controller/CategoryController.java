package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.repository.CategoryRepository;
import com.example.demo.model.Category;

@CrossOrigin(origins = "https://jbrafael-budget-app.vercel.app")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/add")
    public String addCategory(@RequestParam String name,
                              @RequestParam String type) {

        Category category = new Category(name, type);
        categoryRepository.save(category);

        return "Category added";
    }

    @GetMapping("/list")
    public Object listCategories() {
        return categoryRepository.findAll();
    }
}