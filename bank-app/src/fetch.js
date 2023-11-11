import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:4000/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data || []);
        setFilteredTransactions(data || []); // Initialize filteredTransactions with all transactions
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const sortData = (key) => {
    // Implement your sorting logic here
    // ...

    // Update filteredTransactions with sorted data
    setFilteredTransactions([...transactions]);
  };

  const handleSearch = () => {
    // Filter transactions based on the search term
    const filtered = transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredTransactions(filtered);
  };

  const handleDelete = (id) => {
    // Temporarily remove the transaction with the given ID
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
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
