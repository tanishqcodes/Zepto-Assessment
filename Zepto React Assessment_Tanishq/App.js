import React, { useState, useEffect, useRef } from 'react';
import { Chip, Input, List, ListItem, TextField, Popper, Paper, Avatar, ClickAwayListener, Modal, PopoverPaper } from '@mui/material';
import './App.css';

const App = () => {
  const initialItems = [
    { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', logo: 'url_to_johns_logo' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@gmail.com', logo: 'url_to_janes_logo' },
    { id: 3, name: 'Alice', email: 'alice@gmail.com', logo: 'url_to_alices_logo' },
    { id: 4, name: 'Soham Newman', email: 'soham.newman@gmail.com', logo: 'url_to_sohams_logo' },
  ];

  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [suggestions, setSuggestions] = useState(initialItems);
  const [isListOpen, setListOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setListOpen(true);
    updateSuggestions(e.target.value);
  };

  const updateSuggestions = (input) => {
    const remainingSuggestions = initialItems.filter(
      (item) => !chips.find((chip) => chip.label === item.name.toLowerCase())
    );
    setSuggestions(
      remainingSuggestions.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const handleInputClick = () => {
    setListOpen(true);
  };

  const handleItemClick = (item) => {
    setChips((prevChips) => [...prevChips, { id: Date.now(), label: item.name, logo: item.logo }]);
    setInputValue('');
    setListOpen(false);
    updateSuggestions('');
  };

  const handleChipRemove = (chipId) => {
    setChips((prevChips) => {
      const updatedChips = prevChips.filter((chip) => chip.id !== chipId);
      updateSuggestions(inputValue);
      return updatedChips;
    });
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const matchingItems = suggestions.filter(
        (item) => item.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      if (matchingItems.length > 0) {
        const selectedUser = matchingItems[0];
        handleItemClick(selectedUser);
      }
    } else if (e.key === 'Backspace' && inputValue === '') {
      const lastChip = chips[chips.length - 1];
      if (lastChip) {
        handleChipRemove(lastChip.id);
      }
    }
  };

  const handleClickAway = () => {
    setListOpen(false);
  };

  return (
    <div className="App"> Pick Users
      
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
        <div className="chips-container">
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            onDelete={() => handleChipRemove(chip.id)}
            className="chip"
            avatar={<Avatar alt={chip.label} src={chip.logo} />}
          />
        ))}
      </div>
        <TextField            
            className='TextField-root'
            inputRef={inputRef}
            variant="standard"
            placeholder="Add new user..."
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onKeyDown={handleInputKeyDown}
          />          
          <Popper open={isListOpen} anchorEl={inputRef.current} placement="bottom-start">
            <Paper style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <List>
                {suggestions
                  .filter((item) =>!chips.some((chip) => chip.label === item.name))
                  .map((item) => (
                    <ListItem key={item.id} onClick={() => handleItemClick(item)}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={item.name} src={item.logo} />
                        <div style={{ marginLeft: '8px' }}>{item.name} {item.email}</div>
                      </div>
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default App;
