package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.time.LocalDate;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = ?1 AND t.type = 'income'")
    Double getTotalIncome(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = ?1 AND t.type = 'expense'")
    Double getTotalExpense(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = ?1 AND t.type = 'credit'")
    Double getTotalCredit(User user);

    @Query("""
    SELECT t.category.name, SUM(t.amount)
    FROM Transaction t
    WHERE t.user = ?1 AND t.type = 'expense'
    GROUP BY t.category.name
    """)
    java.util.List<Object[]> getExpenseByCategory(User user);

    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}