import React, { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (categoryId) => () => {
    // return index of found element or -1
    const currentCategoryId = checked.indexOf(categoryId);
    const newCheckedCategoryId = [...checked];

    // if checked id is not already in the state > push
    // else unchecked/pull from state
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(categoryId);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    // console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId)
  };

  return categories.map((category, index) => (
    <li key={index} className="list-unstyled">
      <input
        onChange={handleToggle(category._id)}
        value={checked.indexOf(category._id) === -1}
        type="checkbox"
        className="form-check-input"
      />
      <label className="form-check-label">{category.name}</label>
    </li>
  ));
};

export default Checkbox;
