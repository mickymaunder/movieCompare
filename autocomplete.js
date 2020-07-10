const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (e) => {
    const items = await fetchData(e.target.value);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      // console.log(item.Title);
      const option = document.createElement("a");

      option.addEventListener("click", (e) => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener("input", debouce(onInput), 500);

  document.addEventListener("click", (e) => {
    // console.log(e.target);
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
