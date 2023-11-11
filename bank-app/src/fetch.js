import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    category: '',
    amount: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:4000/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data || []);
        setFilteredTransactions(data || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const sortData = (key) => {
    // Filter transactions based on the search term
    const filtered = transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Update filteredTransactions with sorted and filtered data
    setFilteredTransactions([...filtered]);
  };

  const handleSearch = () => {
    // Filter transactions based on the search term
    const filtered = transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Update filteredTransactions with the filtered data
    setFilteredTransactions(filtered);
  };

  const handleDelete = (id) => {
    // Temporarily remove the transaction with the given ID
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePostTransaction = () => {
    // Generate a new ID for the transaction
    const newId = transactions.length > 0 ? Math.max(...transactions.map(transaction => transaction.id)) + 1 : 1;

    // Create a new transaction with today's date and the generated ID
    const today = new Date().toISOString().split('T')[0];
    const newTransactionWithDate = {
      ...newTransaction,
      id: newId,
      date: today
    };

    // Display the new transaction by updating state
    setTransactions(prevState => [...prevState, newTransactionWithDate]);
    setFilteredTransactions(prevState => [...prevState, newTransactionWithDate]);

    // Reset the newTransaction state for the next input
    setNewTransaction({
      description: '',
      category: '',
      amount: ''
    });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          id="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} id="button">Search</button>
      </div>

      <form>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={newTransaction.category}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Amount:
          <input
            type="text"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handlePostTransaction}>Post Transaction</button>
      </form>

      <table id='table'>
        <thead>
          <tr>
            <th onClick={() => sortData('id')}>ID</th>
            <th onClick={() => sortData('Date')}>Date</th>
            <th onClick={() => sortData('description')}>Description</th>
            <th onClick={() => sortData('category')}>Category</th>
            <th onClick={() => sortData('amount')}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.amount}</td>
              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyComponent;
