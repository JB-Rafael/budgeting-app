package com.example.demo.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

@CrossOrigin(origins = "https://jbrafael-budget-app.vercel.app")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    /* ADD TRANSACTION */

    @PostMapping("/add")
    public MessageResponse addTransaction(
            @RequestParam String email,
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

        if(amount == null || amount <= 0 || amount > 1000000){
            return new MessageResponse("Invalid transaction amount");
        }

        if(description == null || description.trim().isEmpty()){
            return new MessageResponse("Description cannot be empty");
        }

        if(description.length() > 30){
            return new MessageResponse("Description must be 30 characters or less");
        }

        String cleanDescription = description.replace("<","").replace(">","");

        User user = optionalUser.get();
        Category category = optionalCategory.get();

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(cleanDescription);
        transaction.setDate(LocalDate.now());
        transaction.setType(category.getType());
        transaction.setUser(user);
        transaction.setCategory(category);

        transactionRepository.save(transaction);

        return new MessageResponse("Transaction added");
    }


    /* TOTAL SUMMARY */

    @GetMapping("/summary")
    public SummaryResponse summary(@RequestParam String email) {

        var optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return new SummaryResponse(0, 0, 0);
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


    /* LIST USER TRANSACTIONS */

    @GetMapping("/list")
    public Object listTransactions(@RequestParam String email) {

        var optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return new MessageResponse("User not found");
        }

        return transactionRepository.findByUser(optionalUser.get());
    }


    /* MONTHLY SUMMARY */

    @GetMapping("/monthly-summary")
    public SummaryResponse monthlySummary(
            @RequestParam String email,
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


    /* CATEGORY BREAKDOWN */

    @GetMapping("/category-breakdown")
    public Object categoryBreakdown(@RequestParam String email) {

        var optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return new MessageResponse("User not found");
        }

        User user = optionalUser.get();

        var result = transactionRepository.getExpenseByCategory(user);

        Map<String, Double> breakdown = new HashMap<>();

        for (Object[] row : result) {
            String category = (String) row[0];
            Double total = (Double) row[1];
            breakdown.put(category, total);
        }

        return breakdown;
    }


    /* DELETE */

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionRepository.deleteById(id);
    }


    /* UPDATE */

    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction updatedTransaction) {

        Transaction transaction = transactionRepository
                .findById(id)
                .orElseThrow();

        Double amount = updatedTransaction.getAmount();
        String description = updatedTransaction.getDescription();

        if(amount == null || amount <= 0 || amount > 1000000){
            throw new RuntimeException("Invalid transaction amount");
        }

        if(description == null || description.trim().isEmpty()){
            throw new RuntimeException("Description cannot be empty");
        }

        if(description.length() > 30){
            throw new RuntimeException("Description must be 30 characters or less");
        }

        String cleanDescription = description.replace("<","").replace(">","");

        transaction.setAmount(amount);
        transaction.setDescription(cleanDescription);
        transaction.setCategory(updatedTransaction.getCategory());
        transaction.setType(updatedTransaction.getType());

        return transactionRepository.save(transaction);
    }


    /* WEEKLY EXPENSES */

    @GetMapping("/weekly-expenses")
    public List<Map<String,Object>> getWeeklyExpenses(@RequestParam String email){

        var optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isEmpty()){
            return new ArrayList<>();
        }

        User user = optionalUser.get();

        LocalDate startDate = LocalDate.now().minusDays(7);

        List<Object[]> results = transactionRepository.getWeeklyExpenses(user, startDate);

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){
            Map<String,Object> item = new HashMap<>();
            item.put("day", row[0].toString());
            item.put("amount", row[1]);
            response.add(item);
        }

        return response;
    }


    /* CATEGORY SUMMARY */

    @GetMapping("/category-summary")
    public List<Map<String,Object>> getCategorySummary(){

        List<Object[]> results = transactionRepository.getCategorySummary();

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){
            Map<String,Object> item = new HashMap<>();
            item.put("category", row[0]);
            item.put("amount", row[1]);
            response.add(item);
        }

        return response;
    }

}