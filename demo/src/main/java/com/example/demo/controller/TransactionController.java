package com.example.demo.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.SummaryResponse;
import com.example.demo.model.Category;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/add")
public MessageResponse addTransaction(@RequestParam String email,
                             @RequestParam Double amount,
                             @RequestParam Long categoryId,
                             @RequestParam String description) {

    var optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        return new MessageResponse("User not found");
    }

    var optionalCategory = categoryRepository.findById(categoryId);

    if (optionalCategory.isEmpty()) {
        return new MessageResponse("Category not found");
    }

    User user = optionalUser.get();
    Category category = optionalCategory.get();

    Transaction transaction = new Transaction();
    transaction.setAmount(amount);
    transaction.setDescription(description);
    transaction.setDate(java.time.LocalDate.now());
    transaction.setType(category.getType());
    transaction.setUser(user);
    transaction.setCategory(category);

    transactionRepository.save(transaction);

    return new MessageResponse("Transaction added");
}

    @GetMapping("/summary")
public SummaryResponse summary(@RequestParam String email) {

    var optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        return new SummaryResponse(0,0,0);
    }

    User user = optionalUser.get();

    Double income = transactionRepository.getTotalIncome(user);
    Double expense = transactionRepository.getTotalExpense(user);
    Double credit = transactionRepository.getTotalCredit(user);

    if (income == null) income = 0.0;
    if (expense == null) expense = 0.0;
    if (credit == null) credit = 0.0;

    double balance = income - expense - credit;

    return new SummaryResponse(income, expense, balance);
}

    @GetMapping("/list")
public Object listTransactions(@RequestParam String email) {

    var optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        return new MessageResponse("User not found");
    }

    User user = optionalUser.get();

    return transactionRepository.findByUser(user);
}

    @GetMapping("/monthly-summary")
public SummaryResponse monthlySummary(@RequestParam String email,
                             @RequestParam int year,
                             @RequestParam int month) {

    var optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        return new SummaryResponse(0, 0, 0);
    }

    User user = optionalUser.get();

    LocalDate start = LocalDate.of(year, month, 1);
    LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

    var transactions = transactionRepository
            .findByUserAndDateBetween(user, start, end);

    double income = 0;
    double expense = 0;

    for (Transaction t : transactions) {
        if (t.getType().equals("income")) {
            income += t.getAmount();
        } else {
            expense += t.getAmount();
        }
    }

    double balance = income - expense;

    return new SummaryResponse(income, expense, balance);
}

    @GetMapping("/category-breakdown")
public Object categoryBreakdown(@RequestParam String email) {

    var optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        return new MessageResponse("User not found");
    }

    User user = optionalUser.get();

    var result = transactionRepository.getExpenseByCategory(user);

    java.util.Map<String, Double> breakdown = new java.util.HashMap<>();

    for (Object[] row : result) {
        String category = (String) row[0];
        Double total = (Double) row[1];
        breakdown.put(category, total);
    }

    return breakdown;
}
}