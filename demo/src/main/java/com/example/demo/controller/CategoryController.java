package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;

@CrossOrigin(origins = "https://budgeting-app-nine-pi.vercel.app/")
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