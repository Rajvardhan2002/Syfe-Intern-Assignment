document
  .getElementById("reportForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    try {
      const response = await fetch(`/reports/data?month=${month}&year=${year}`);
      const data = await response.json();

      console.log("Fetched Report Data:", data); // DEBUG

      if (data.error) throw new Error(data.error);

      // Update Summary
      document.getElementById("income").textContent = data.income;
      document.getElementById("expenses").textContent = data.expenses;
      document.getElementById("savings").textContent = data.savings;

      // Render Spending Chart
      renderSpendingChart(data.spendingByCategory);

      // Render Income vs Expenses Chart
      renderIncomeVsExpensesChart(data.income, data.expenses, data.savings);
    } catch (error) {
      console.error("Failed to fetch report:", error.message);
    }
  });
