import { useState } from "react";

export default function App() {
  const localStorageItems = JSON.parse(localStorage.getItem("items"));

  const [items, setItems] = useState(
    localStorageItems ? localStorageItems : []
  );

  function onDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function onToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function onClearList() {
    if (!items.length) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete all of your lists"
    );
    if (confirmed) setItems([]);
  }

  localStorage.setItem("items", JSON.stringify(items));

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={setItems} />
      <List
        items={items}
        onDeleteItem={onDeleteItem}
        onToggleItem={onToggleItem}
        onClearList={onClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 👜</h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };

    onAddItems((items) => [...items, newItem]);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What'd you like to pack ? 😊</h3>
      <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => (
          <option value={i} key={i}>
            {i}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function List({ items, onDeleteItem, onToggleItem, onClearList }) {
  const localeSort = JSON.parse(localStorage.getItem("sort"));

  const [sortBy, setSortBy] = useState(localeSort ? localeSort : "input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  else if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  else
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  localStorage.setItem("sort", JSON.stringify(sortBy));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort By Input</option>
          <option value="description">Sort By Description</option>
          <option value="packed">Sort By Packed</option>
        </select>
        <button onClick={onClearList}>ClearList</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <div style={item.packed ? { textDecoration: "line-through" } : {}}>
        <span>{item.quantity} </span>
        <span>{item.description}</span>
      </div>

      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </footer>
    );

  const itemLength = items.length;
  const packedItem = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedItem / itemLength) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100 ? (
          "You've got everything you need. Ready to go ✈️"
        ) : (
          <>
            You have {itemLength} items and you'v packed {packedItem} Items and
            ({percentage}
            %)'s packed
          </>
        )}
      </em>
    </footer>
  );
}
