package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query(value = """
    SELECT DATE(date) as day, SUM(amount) as amount
    FROM transactions
    WHERE type = 'expense'
    AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(date)
    ORDER BY DATE(date)
    """, nativeQuery = true)
    List<Object[]> getWeeklyExpenses();

    @Query("""
SELECT t.date, SUM(t.amount)
FROM Transaction t
WHERE t.user = :user
AND t.type = 'expense'
AND t.date >= :startDate
GROUP BY t.date
ORDER BY t.date
""")
List<Object[]> getWeeklyExpenses(
    @Param("user") User user,
    @Param("startDate") LocalDate startDate
);

    @Query(value = """
    SELECT category, SUM(amount) as amount
    FROM transactions
    WHERE type = 'expense'
    GROUP BY category
    """, nativeQuery = true)
    List<Object[]> getCategorySummary();

    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}