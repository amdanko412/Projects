import { useState, useEffect } from "react";
import phonebookService from "./phonebook";
axios.get('http://localhost:3001/api/persons')

const [notification, setNotification] = useState(null);
const Filter = ({ search, handleSearchChange }) => (
  <div>
    Filter shown with: <input value={search} onChange={handleSearchChange} />
  </div>
);

const Notification = ({ message }) => {
  if (message === null) return null;
return (
    <div style={{
      color: "green",
      background: "#ccffcc",
      fontSize: 20,
      border: "2px solid green",
      padding: 10,
      marginBottom: 20,
      borderRadius: 5
    }}>
      {message}
    </div>
  );
};
const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, deletePerson }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    phonebookService.getAll().then(initialPersons => setPersons(initialPersons));
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        phonebookService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName("");
            setNewNumber("");
          })
          .catch(error => {
            alert(`Failed to update ${newName}. It may have been removed from the server.`);
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    phonebookService.create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        setNewName("");
        setNewNumber("");
      });
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id));
      });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
