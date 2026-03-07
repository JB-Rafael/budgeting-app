package com.example.demo.dto;

public class SummaryResponse {

    private double income;
    private double expense;
    private double balance;

    public SummaryResponse(double income, double expense, double balance) {
        this.income = income;
        this.expense = expense;
        this.balance = balance;
    }

    public double getIncome() {
        return income;
    }

    public double getExpense() {
        return expense;
    }

    public double getBalance() {
        return balance;
    }
}